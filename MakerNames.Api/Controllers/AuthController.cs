using MakerNames.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace MakerNames.Api.Controllers;

[ApiController]
[EnableRateLimiting("auth")]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private const string SessionCookieName = "makernames_session";

    private readonly UserStore _users;
    private readonly EmailSender _emails;
    private readonly IWebHostEnvironment _environment;

    public AuthController(UserStore users, EmailSender emails, IWebHostEnvironment environment)
    {
        _users = users;
        _emails = emails;
        _environment = environment;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var validation = ValidateCredentials(request.Email, request.Password);
        if (validation != null)
            return BadRequest(new AuthMessageResponse(validation));

        var result = await _users.RegisterAsync(
            request.Name?.Trim() ?? "",
            request.Email!.Trim(),
            request.Password!
        );

        if (result.RequiresEmailVerification)
        {
            await SendVerificationEmailAsync(result.User!, result.EmailVerificationToken!);
            await _emails.SendNewSignupNotificationAsync(result.User!);
            return Ok(new AuthMessageResponse(result.Error ?? "Account created. Check your email to activate it."));
        }

        if (!result.Succeeded)
            return BadRequest(new AuthMessageResponse(result.Error ?? "We could not create this account."));

        return BadRequest(new AuthMessageResponse("We could not create this account."));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var validation = ValidateCredentials(request.Email, request.Password);
        if (validation != null)
            return BadRequest(new AuthMessageResponse(validation));

        var result = await _users.LoginAsync(request.Email!.Trim(), request.Password!);

        if (!result.Succeeded)
        {
            if (result.RequiresEmailVerification && result.User != null && result.EmailVerificationToken != null)
            {
                await SendVerificationEmailAsync(result.User, result.EmailVerificationToken);
                return StatusCode(StatusCodes.Status403Forbidden, new AuthMessageResponse(result.Error ?? "Activate your account before signing in."));
            }

            return Unauthorized(new AuthMessageResponse(result.Error ?? "Invalid login."));
        }

        SetSessionCookie(result.Token!, result.ExpiresAt!.Value);
        return Ok(new AuthResponse(result.User!));
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string? token)
    {
        var result = await _users.VerifyEmailAsync(token);

        if (!result.Succeeded)
            return Redirect($"/?emailVerified=0&message={Uri.EscapeDataString(result.Error ?? "Invalid link.")}");

        SetSessionCookie(result.Token!, result.ExpiresAt!.Value);
        return Redirect("/?emailVerified=1");
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<AuthMessageResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !UserStore.IsValidEmail(request.Email.Trim()))
            return BadRequest(new AuthMessageResponse("Enter a valid email address."));

        var reset = await _users.CreatePasswordResetAsync(request.Email.Trim());
        if (reset != null)
            await SendPasswordResetEmailAsync(reset.User, reset.Token);

        return Ok(new AuthMessageResponse("If an account exists for this email, we sent a password reset link."));
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<AuthResponse>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            return BadRequest(new AuthMessageResponse("Password must be at least 8 characters."));

        var result = await _users.ResetPasswordAsync(request.Token, request.Password);

        if (!result.Succeeded)
            return BadRequest(new AuthMessageResponse(result.Error ?? "We could not update your password."));

        SetSessionCookie(result.Token!, result.ExpiresAt!.Value);
        return Ok(new AuthResponse(result.User!));
    }

    [HttpPost("logout")]
    public async Task<ActionResult<AuthMessageResponse>> Logout()
    {
        await _users.DeleteSessionAsync(Request.Cookies[SessionCookieName]);
        Response.Cookies.Delete(SessionCookieName, CreateCookieOptions(DateTimeOffset.UtcNow.AddDays(-1)));
        return Ok(new AuthMessageResponse("Signed out."));
    }

    [HttpGet("me")]
    public async Task<ActionResult<AuthResponse>> Me()
    {
        var user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);

        if (user == null)
            return Unauthorized(new AuthMessageResponse("Session expired."));

        return Ok(new AuthResponse(user));
    }

    private string? ValidateCredentials(string? email, string? password)
    {
        if (string.IsNullOrWhiteSpace(email) || !UserStore.IsValidEmail(email.Trim()))
            return "Enter a valid email address.";

        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
            return "Password must be at least 8 characters.";

        return null;
    }

    private void SetSessionCookie(string token, DateTimeOffset expiresAt)
    {
        Response.Cookies.Append(SessionCookieName, token, CreateCookieOptions(expiresAt));
    }

    private CookieOptions CreateCookieOptions(DateTimeOffset expiresAt)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            Path = "/",
            SameSite = SameSiteMode.Lax,
            Secure = !_environment.IsDevelopment() || Request.IsHttps,
            Expires = expiresAt
        };
    }

    private async Task SendVerificationEmailAsync(PublicUser user, string token)
    {
        var verifyUrl = Url.ActionLink(
            nameof(VerifyEmail),
            "Auth",
            new { token },
            Request.Scheme,
            Request.Host.ToString()
        );

        if (string.IsNullOrWhiteSpace(verifyUrl))
            verifyUrl = $"{Request.Scheme}://{Request.Host}/api/Auth/verify-email?token={Uri.EscapeDataString(token)}";

        await _emails.SendAccountVerificationAsync(user.Email, user.Name, verifyUrl);
    }

    private async Task SendPasswordResetEmailAsync(PublicUser user, string token)
    {
        var resetUrl = $"{Request.Scheme}://{Request.Host}/?resetPassword={Uri.EscapeDataString(token)}";

        await _emails.SendPasswordResetAsync(user.Email, user.Name, resetUrl);
    }
}

public sealed record RegisterRequest(string? Name, string? Email, string? Password);

public sealed record LoginRequest(string? Email, string? Password);

public sealed record ForgotPasswordRequest(string? Email);

public sealed record ResetPasswordRequest(string? Token, string? Password);

public sealed record AuthResponse(PublicUser User);

public sealed record AuthMessageResponse(string Message);
