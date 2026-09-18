using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Data.SqlClient;

namespace MakerNames.Api.Services;

public sealed class UserStore
{
    private const int CurrentPasswordIterations = 600_000;
    private const int LegacyPasswordIterations = 210_000;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };

    private readonly SemaphoreSlim _gate = new(1, 1);
    private readonly string? _connectionString;
    private readonly string _filePath;

    public UserStore(IWebHostEnvironment environment, IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("AuthDatabase");
        _filePath = Path.Combine(environment.ContentRootPath, "App_Data", "auth.json");
    }

    public async Task<AuthResult> RegisterAsync(string name, string email, string password)
    {
        var normalizedEmail = NormalizeEmail(email);

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            RemoveExpiredSessions(data);

            if (data.Users.Any(user => user.Email == normalizedEmail))
                return AuthResult.Fail("An account already exists with this email.");

            var salt = RandomNumberGenerator.GetBytes(16);
            var user = new StoredUser
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = string.IsNullOrWhiteSpace(name) ? normalizedEmail.Split('@')[0] : name.Trim(),
                Email = normalizedEmail,
                PasswordSalt = ToBase64Url(salt),
                PasswordHash = HashPassword(password, salt),
                Plan = "free",
                CreatedAt = DateTimeOffset.UtcNow,
                DownloadMonth = GetCurrentMonthKey()
            };

            var verificationToken = CreateEmailVerificationToken(user);
            ApplyPendingStripeEntitlement(data, user);
            data.Users.Add(user);
            await SaveDataCoreAsync(data);

            return AuthResult.EmailVerificationRequired(ToPublicUser(user), verificationToken);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var normalizedEmail = NormalizeEmail(email);

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            RemoveExpiredSessions(data);

            var user = data.Users.FirstOrDefault(item => item.Email == normalizedEmail);
            if (user == null || !VerifyPassword(password, user.PasswordSalt, user.PasswordHash))
                return AuthResult.Fail("Email or password is incorrect.");

            if (!user.EmailVerified)
            {
                var verificationToken = CreateEmailVerificationToken(user);
                await SaveDataCoreAsync(data);
                return AuthResult.EmailVerificationRequired(
                    ToPublicUser(user),
                    verificationToken,
                    "You still need to activate your account. We sent a new verification email."
                );
            }

            var session = CreateSession(user.Id);
            data.Sessions.Add(session.StoredSession);
            await SaveDataCoreAsync(data);

            return AuthResult.Success(ToPublicUser(user), session.Token, session.StoredSession.ExpiresAt);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<AuthResult> VerifyEmailAsync(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return AuthResult.Fail("Invalid verification link.");

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            RemoveExpiredSessions(data);

            var tokenHash = HashToken(token);
            var now = DateTimeOffset.UtcNow;
            var user = data.Users.FirstOrDefault(item =>
                HasValidEmailVerificationToken(item, tokenHash, now)
            );

            if (user == null)
                return AuthResult.Fail("This verification link is invalid or expired.");

            user.EmailVerified = true;
            user.EmailVerifiedAt = now;
            user.EmailVerificationTokenHash = null;
            user.EmailVerificationExpiresAt = null;
            user.EmailVerificationTokens.Clear();

            var session = CreateSession(user.Id);
            data.Sessions.Add(session.StoredSession);
            await SaveDataCoreAsync(data);

            return AuthResult.Success(ToPublicUser(user), session.Token, session.StoredSession.ExpiresAt);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<PasswordResetIssue?> CreatePasswordResetAsync(string email)
    {
        var normalizedEmail = NormalizeEmail(email);

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            RemoveExpiredSessions(data);

            var user = data.Users.FirstOrDefault(item => item.Email == normalizedEmail);
            if (user == null)
                return null;

            var token = CreatePasswordResetToken(user);
            await SaveDataCoreAsync(data);

            return new PasswordResetIssue(ToPublicUser(user), token);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<AuthResult> ResetPasswordAsync(string? token, string password)
    {
        if (string.IsNullOrWhiteSpace(token))
            return AuthResult.Fail("Invalid password reset link.");

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            RemoveExpiredSessions(data);

            var tokenHash = HashToken(token);
            var now = DateTimeOffset.UtcNow;
            var user = data.Users.FirstOrDefault(item =>
                HasValidPasswordResetToken(item, tokenHash, now)
            );

            if (user == null)
                return AuthResult.Fail("This password reset link is invalid or expired.");

            var salt = RandomNumberGenerator.GetBytes(16);
            user.PasswordSalt = ToBase64Url(salt);
            user.PasswordHash = HashPassword(password, salt);
            user.PasswordResetTokenHash = null;
            user.PasswordResetExpiresAt = null;
            user.PasswordResetTokens.Clear();

            var session = CreateSession(user.Id);
            data.Sessions.Add(session.StoredSession);
            await SaveDataCoreAsync(data);

            return AuthResult.Success(ToPublicUser(user), session.Token, session.StoredSession.ExpiresAt);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<PublicUser?> GetUserBySessionAsync(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return null;

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var changed = RemoveExpiredSessions(data);
            var tokenHash = HashToken(token);
            var session = data.Sessions.FirstOrDefault(item => item.TokenHash == tokenHash);

            if (session == null)
            {
                if (changed)
                    await SaveDataCoreAsync(data);

                return null;
            }

            var user = data.Users.FirstOrDefault(item => item.Id == session.UserId);
            if (user == null)
            {
                data.Sessions.Remove(session);
                await SaveDataCoreAsync(data);
                return null;
            }

            if (!user.EmailVerified)
            {
                data.Sessions.Remove(session);
                await SaveDataCoreAsync(data);
                return null;
            }

            changed = ResetMonthlyUsageIfNeeded(user) || changed;
            changed = ApplyPendingStripeEntitlement(data, user) || changed;

            if (changed)
                await SaveDataCoreAsync(data);

            return ToPublicUser(user);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task DeleteSessionAsync(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return;

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var tokenHash = HashToken(token);
            data.Sessions.RemoveAll(item => item.TokenHash == tokenHash);
            RemoveExpiredSessions(data);
            await SaveDataCoreAsync(data);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<StripeEntitlementResult> ApplyStripeCheckoutAsync(
        string? email,
        string? customerId,
        string? subscriptionId,
        string plan,
        string? eventId
    )
    {
        if (string.IsNullOrWhiteSpace(email))
            return StripeEntitlementResult.Fail("Stripe event did not include a customer email.");

        var normalizedEmail = NormalizeEmail(email);
        var normalizedPlan = NormalizePlan(plan);

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var user = data.Users.FirstOrDefault(item => item.Email == normalizedEmail);

            if (user != null)
            {
                ApplyPlan(user, normalizedPlan, customerId, subscriptionId);
                await SaveDataCoreAsync(data);
                return StripeEntitlementResult.Success(ToPublicUser(user), false);
            }

            UpsertPendingStripeEntitlement(data, normalizedEmail, normalizedPlan, customerId, subscriptionId, eventId);
            await SaveDataCoreAsync(data);
            return StripeEntitlementResult.Success(null, true);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<StripeEntitlementResult> ApplyStripeSubscriptionAsync(
        string? customerId,
        string? subscriptionId,
        string? email,
        string plan,
        bool active,
        string? eventId
    )
    {
        var normalizedEmail = string.IsNullOrWhiteSpace(email) ? null : NormalizeEmail(email);
        var normalizedPlan = active ? NormalizePlan(plan) : "free";

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var user = data.Users.FirstOrDefault(item =>
                (!string.IsNullOrWhiteSpace(subscriptionId) && item.StripeSubscriptionId == subscriptionId) ||
                (!string.IsNullOrWhiteSpace(customerId) && item.StripeCustomerId == customerId) ||
                (!string.IsNullOrWhiteSpace(normalizedEmail) && item.Email == normalizedEmail)
            );

            if (user != null)
            {
                ApplyPlan(user, normalizedPlan, customerId, subscriptionId);
                await SaveDataCoreAsync(data);
                return StripeEntitlementResult.Success(ToPublicUser(user), false);
            }

            if (active && normalizedEmail != null)
            {
                UpsertPendingStripeEntitlement(data, normalizedEmail, normalizedPlan, customerId, subscriptionId, eventId);
                await SaveDataCoreAsync(data);
                return StripeEntitlementResult.Success(null, true);
            }

            return StripeEntitlementResult.Fail("No matching MakerNames account found for this Stripe subscription.");
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<DownloadQuotaResult> ConsumeDownloadAsync(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return DownloadQuotaResult.Fail("Sign in to download your files.", 401);

        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var changed = RemoveExpiredSessions(data);
            var tokenHash = HashToken(token);
            var session = data.Sessions.FirstOrDefault(item => item.TokenHash == tokenHash);

            if (session == null)
            {
                if (changed)
                    await SaveDataCoreAsync(data);

                return DownloadQuotaResult.Fail("Your session expired. Please sign in again.", 401);
            }

            var user = data.Users.FirstOrDefault(item => item.Id == session.UserId);
            if (user == null)
            {
                data.Sessions.Remove(session);
                await SaveDataCoreAsync(data);
                return DownloadQuotaResult.Fail("Account not found.", 401);
            }

            if (!user.EmailVerified)
            {
                data.Sessions.Remove(session);
                await SaveDataCoreAsync(data);
                return DownloadQuotaResult.Fail("Activate your account by email before downloading.", 403);
            }

            changed = ResetMonthlyUsageIfNeeded(user) || changed;

            user.DownloadsThisMonth += 1;
            await SaveDataCoreAsync(data);

            return DownloadQuotaResult.Success(ToPublicUser(user));
        }
        finally
        {
            _gate.Release();
        }
    }

    public static bool IsValidEmail(string email)
    {
        try
        {
            var address = new MailAddress(email);
            return string.Equals(address.Address, email, StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    private async Task<AuthData> LoadDataCoreAsync()
    {
        if (!string.IsNullOrWhiteSpace(_connectionString))
            return await LoadSqlDataCoreAsync();

        if (!File.Exists(_filePath))
            return new AuthData();

        await using var stream = File.OpenRead(_filePath);
        return await JsonSerializer.DeserializeAsync<AuthData>(stream, JsonOptions) ?? new AuthData();
    }

    private async Task SaveDataCoreAsync(AuthData data)
    {
        if (!string.IsNullOrWhiteSpace(_connectionString))
        {
            await SaveSqlDataCoreAsync(data);
            return;
        }

        var directory = Path.GetDirectoryName(_filePath);
        if (!string.IsNullOrWhiteSpace(directory))
            Directory.CreateDirectory(directory);

        await using var stream = File.Create(_filePath);
        await JsonSerializer.SerializeAsync(stream, data, JsonOptions);
    }

    private async Task<AuthData> LoadSqlDataCoreAsync()
    {
        await using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        await EnsureSqlSchemaAsync(connection);

        await using var command = new SqlCommand(
            "SELECT Json FROM AppState WHERE [Key] = @key",
            connection
        );
        command.Parameters.AddWithValue("@key", "auth");

        var json = await command.ExecuteScalarAsync() as string;
        if (string.IsNullOrWhiteSpace(json))
            return new AuthData();

        return JsonSerializer.Deserialize<AuthData>(json, JsonOptions) ?? new AuthData();
    }

    private async Task SaveSqlDataCoreAsync(AuthData data)
    {
        await using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        await EnsureSqlSchemaAsync(connection);

        var json = JsonSerializer.Serialize(data, JsonOptions);
        await using var command = new SqlCommand(
            """
            MERGE AppState AS target
            USING (SELECT @key AS [Key], @json AS Json) AS source
            ON target.[Key] = source.[Key]
            WHEN MATCHED THEN UPDATE SET Json = source.Json, UpdatedAt = SYSUTCDATETIME()
            WHEN NOT MATCHED THEN INSERT ([Key], Json, UpdatedAt) VALUES (source.[Key], source.Json, SYSUTCDATETIME());
            """,
            connection
        );
        command.Parameters.AddWithValue("@key", "auth");
        command.Parameters.AddWithValue("@json", json);
        await command.ExecuteNonQueryAsync();
    }

    private static async Task EnsureSqlSchemaAsync(SqlConnection connection)
    {
        await using var command = new SqlCommand(
            """
            IF OBJECT_ID(N'dbo.AppState', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.AppState
                (
                    [Key] nvarchar(100) NOT NULL CONSTRAINT PK_AppState PRIMARY KEY,
                    Json nvarchar(max) NOT NULL,
                    UpdatedAt datetime2 NOT NULL
                );
            END
            """,
            connection
        );
        await command.ExecuteNonQueryAsync();
    }

    private static bool RemoveExpiredSessions(AuthData data)
    {
        var before = data.Sessions.Count;
        var now = DateTimeOffset.UtcNow;
        data.Sessions.RemoveAll(session => session.ExpiresAt <= now);
        return before != data.Sessions.Count;
    }

    private static bool ResetMonthlyUsageIfNeeded(StoredUser user)
    {
        var monthKey = GetCurrentMonthKey();

        if (user.DownloadMonth == monthKey)
            return false;

        user.DownloadMonth = monthKey;
        user.DownloadsThisMonth = 0;
        return true;
    }

    private static bool ApplyPendingStripeEntitlement(AuthData data, StoredUser user)
    {
        var pending = data.PendingStripeEntitlements.FirstOrDefault(item => item.Email == user.Email);
        if (pending == null)
            return false;

        ApplyPlan(user, pending.Plan, pending.CustomerId, pending.SubscriptionId);
        data.PendingStripeEntitlements.Remove(pending);
        return true;
    }

    private static void UpsertPendingStripeEntitlement(
        AuthData data,
        string email,
        string plan,
        string? customerId,
        string? subscriptionId,
        string? eventId
    )
    {
        var pending = data.PendingStripeEntitlements.FirstOrDefault(item => item.Email == email);
        if (pending == null)
        {
            pending = new StoredStripeEntitlement { Email = email };
            data.PendingStripeEntitlements.Add(pending);
        }

        pending.Plan = plan;
        pending.CustomerId = customerId;
        pending.SubscriptionId = subscriptionId;
        pending.LastEventId = eventId;
        pending.UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static void ApplyPlan(StoredUser user, string plan, string? customerId, string? subscriptionId)
    {
        user.Plan = NormalizePlan(plan);
        user.StripeCustomerId = string.IsNullOrWhiteSpace(customerId) ? user.StripeCustomerId : customerId;
        user.StripeSubscriptionId = string.IsNullOrWhiteSpace(subscriptionId) ? user.StripeSubscriptionId : subscriptionId;
        user.PlanUpdatedAt = DateTimeOffset.UtcNow;
    }

    private static string NormalizePlan(string plan)
    {
        var normalized = plan.Trim().ToLowerInvariant();
        return normalized is "monthly" or "studio" ? normalized : "free";
    }

    private static string GetCurrentMonthKey()
    {
        return DateTimeOffset.UtcNow.ToString("yyyy-MM");
    }

    private static SessionIssue CreateSession(string userId)
    {
        var token = ToBase64Url(RandomNumberGenerator.GetBytes(32));
        var now = DateTimeOffset.UtcNow;

        return new SessionIssue(
            token,
            new StoredSession
            {
                TokenHash = HashToken(token),
                UserId = userId,
                CreatedAt = now,
                ExpiresAt = now.AddDays(30)
            }
        );
    }

    private static string CreateEmailVerificationToken(StoredUser user)
    {
        var token = ToBase64Url(RandomNumberGenerator.GetBytes(32));
        var expiresAt = DateTimeOffset.UtcNow.AddHours(24);
        PruneExpiredEmailVerificationTokens(user, DateTimeOffset.UtcNow);

        user.EmailVerificationTokenHash = HashToken(token);
        user.EmailVerificationExpiresAt = expiresAt;
        user.EmailVerificationTokens.Add(new StoredEmailVerificationToken
        {
            TokenHash = user.EmailVerificationTokenHash,
            ExpiresAt = expiresAt
        });

        return token;
    }

    private static string CreatePasswordResetToken(StoredUser user)
    {
        var token = ToBase64Url(RandomNumberGenerator.GetBytes(32));
        var expiresAt = DateTimeOffset.UtcNow.AddHours(1);
        PruneExpiredPasswordResetTokens(user, DateTimeOffset.UtcNow);

        user.PasswordResetTokenHash = HashToken(token);
        user.PasswordResetExpiresAt = expiresAt;
        user.PasswordResetTokens.Add(new StoredPasswordResetToken
        {
            TokenHash = user.PasswordResetTokenHash,
            ExpiresAt = expiresAt
        });

        return token;
    }

    private static bool HasValidEmailVerificationToken(StoredUser user, string tokenHash, DateTimeOffset now)
    {
        PruneExpiredEmailVerificationTokens(user, now);

        if (user.EmailVerificationTokenHash == tokenHash && user.EmailVerificationExpiresAt > now)
            return true;

        return user.EmailVerificationTokens.Any(item =>
            item.TokenHash == tokenHash &&
            item.ExpiresAt > now
        );
    }

    private static bool HasValidPasswordResetToken(StoredUser user, string tokenHash, DateTimeOffset now)
    {
        PruneExpiredPasswordResetTokens(user, now);

        if (user.PasswordResetTokenHash == tokenHash && user.PasswordResetExpiresAt > now)
            return true;

        return user.PasswordResetTokens.Any(item =>
            item.TokenHash == tokenHash &&
            item.ExpiresAt > now
        );
    }

    private static void PruneExpiredEmailVerificationTokens(StoredUser user, DateTimeOffset now)
    {
        user.EmailVerificationTokens.RemoveAll(item => item.ExpiresAt <= now);
    }

    private static void PruneExpiredPasswordResetTokens(StoredUser user, DateTimeOffset now)
    {
        user.PasswordResetTokens.RemoveAll(item => item.ExpiresAt <= now);
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static string HashPassword(string password, byte[] salt)
    {
        return HashPassword(password, salt, CurrentPasswordIterations);
    }

    private static string HashPassword(string password, byte[] salt, int iterations)
    {
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            32
        );

        return ToBase64Url(hash);
    }

    private static bool VerifyPassword(string password, string storedSalt, string storedHash)
    {
        var salt = FromBase64Url(storedSalt);
        var computedHash = FromBase64Url(HashPassword(password, salt, CurrentPasswordIterations));
        var savedHash = FromBase64Url(storedHash);

        if (computedHash.Length == savedHash.Length &&
            CryptographicOperations.FixedTimeEquals(computedHash, savedHash))
            return true;

        var legacyHash = FromBase64Url(HashPassword(password, salt, LegacyPasswordIterations));
        return legacyHash.Length == savedHash.Length &&
               CryptographicOperations.FixedTimeEquals(legacyHash, savedHash);
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }

    private static PublicUser ToPublicUser(StoredUser user)
    {
        return new PublicUser(
            user.Id,
            user.Name,
            user.Email,
            user.Plan,
            user.DownloadsThisMonth,
            -1,
            -1,
            user.DownloadMonth,
            user.EmailVerified
        );
    }

    private static string ToBase64Url(byte[] bytes)
    {
        return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }

    private static byte[] FromBase64Url(string value)
    {
        var padded = value.Replace('-', '+').Replace('_', '/');
        padded = padded.PadRight(padded.Length + (4 - padded.Length % 4) % 4, '=');
        return Convert.FromBase64String(padded);
    }

    private sealed record SessionIssue(string Token, StoredSession StoredSession);
}

public sealed record PublicUser(
    string Id,
    string Name,
    string Email,
    string Plan,
    int DownloadsUsed,
    int DownloadsLimit,
    int DownloadsRemaining,
    string DownloadMonth,
    bool EmailVerified
);

public sealed record PasswordResetIssue(PublicUser User, string Token);

public sealed record AuthResult(
    bool Succeeded,
    PublicUser? User,
    string? Token,
    DateTimeOffset? ExpiresAt,
    string? Error,
    bool RequiresEmailVerification,
    string? EmailVerificationToken
)
{
    public static AuthResult Success(PublicUser user, string token, DateTimeOffset expiresAt)
    {
        return new AuthResult(true, user, token, expiresAt, null, false, null);
    }

    public static AuthResult Fail(string error)
    {
        return new AuthResult(false, null, null, null, error, false, null);
    }

    public static AuthResult EmailVerificationRequired(PublicUser user, string verificationToken, string? message = null)
    {
        return new AuthResult(
            false,
            user,
            null,
            null,
            message ?? "Account created. Check your email to activate it.",
            true,
            verificationToken
        );
    }
}

public sealed class AuthData
{
    public List<StoredUser> Users { get; set; } = [];
    public List<StoredSession> Sessions { get; set; } = [];
    public List<StoredStripeEntitlement> PendingStripeEntitlements { get; set; } = [];
}

public sealed class StoredUser
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordSalt { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Plan { get; set; } = "free";
    public DateTimeOffset CreatedAt { get; set; }
    public bool EmailVerified { get; set; }
    public DateTimeOffset? EmailVerifiedAt { get; set; }
    public string? EmailVerificationTokenHash { get; set; }
    public DateTimeOffset? EmailVerificationExpiresAt { get; set; }
    public List<StoredEmailVerificationToken> EmailVerificationTokens { get; set; } = [];
    public string? PasswordResetTokenHash { get; set; }
    public DateTimeOffset? PasswordResetExpiresAt { get; set; }
    public List<StoredPasswordResetToken> PasswordResetTokens { get; set; } = [];
    public string DownloadMonth { get; set; } = "";
    public int DownloadsThisMonth { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public DateTimeOffset? PlanUpdatedAt { get; set; }
}

public sealed class StoredStripeEntitlement
{
    public string Email { get; set; } = "";
    public string Plan { get; set; } = "free";
    public string? CustomerId { get; set; }
    public string? SubscriptionId { get; set; }
    public string? LastEventId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public sealed class StoredEmailVerificationToken
{
    public string TokenHash { get; set; } = "";
    public DateTimeOffset ExpiresAt { get; set; }
}

public sealed class StoredPasswordResetToken
{
    public string TokenHash { get; set; } = "";
    public DateTimeOffset ExpiresAt { get; set; }
}

public sealed class StoredSession
{
    public string TokenHash { get; set; } = "";
    public string UserId { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
}

public sealed record DownloadQuotaResult(bool Succeeded, PublicUser? User, string? Error, int StatusCode)
{
    public static DownloadQuotaResult Success(PublicUser user)
    {
        return new DownloadQuotaResult(true, user, null, 200);
    }

    public static DownloadQuotaResult Fail(string error, int statusCode, PublicUser? user = null)
    {
        return new DownloadQuotaResult(false, user, error, statusCode);
    }
}

public sealed record StripeEntitlementResult(bool Succeeded, PublicUser? User, bool Pending, string? Error)
{
    public static StripeEntitlementResult Success(PublicUser? user, bool pending)
    {
        return new StripeEntitlementResult(true, user, pending, null);
    }

    public static StripeEntitlementResult Fail(string error)
    {
        return new StripeEntitlementResult(false, null, false, error);
    }
}
