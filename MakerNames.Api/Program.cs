using MakerNames.Api.Services;
using MakerNames.Core.Generators;
using Microsoft.AspNetCore.HttpOverrides;
using System.Diagnostics;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
var desktopMode = args.Any(arg => string.Equals(arg, "--desktop", StringComparison.OrdinalIgnoreCase)) ||
    string.Equals(Environment.GetEnvironmentVariable("MAKERNAMES_DESKTOP"), "1", StringComparison.OrdinalIgnoreCase);
var desktopUrl = "http://127.0.0.1:58731";

if (desktopMode)
{
    builder.WebHost.UseUrls(desktopUrl);
}

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services to the container.

builder.Services.AddControllers();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.ForwardLimit = 1;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 20,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }
        )
    );
});

builder.Services.AddHttpClient("image-search")
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
    {
        AllowAutoRedirect = false
    });

builder.Services.AddSingleton<UserStore>();

builder.Services.AddSingleton<CommunityStore>();

builder.Services.AddSingleton<CommunityAccessoryStore>();

builder.Services.AddSingleton<DownloadLibraryStore>();

builder.Services.AddSingleton<EmailSender>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

FontRegistry.Configure(Path.Combine(app.Environment.WebRootPath, "fonts"));

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseForwardedHeaders();

app.Use(async (context, next) =>
{
    context.Response.Headers.TryAdd("X-Content-Type-Options", "nosniff");
    context.Response.Headers.TryAdd("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.TryAdd("X-Frame-Options", "DENY");
    context.Response.Headers.TryAdd("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    var path = context.Request.Path.Value;

    if (string.IsNullOrEmpty(path) || path == "/")
        context.Request.Path = "/v3/index.html";
    else if (path == "/editor.html")
        context.Request.Path = "/v3/editor.html";
    else if (path is "/style.css" or "/script.js")
        context.Request.Path = "/v3" + path;

    await next();
});

// IMPORTANTE PARA O SITE HTML
app.UseDefaultFiles();

app.UseStaticFiles();

if (!desktopMode)
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

if (desktopMode)
{
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var url = $"{desktopUrl}/editor.html?desktop=1";

        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });
        }
        catch (Exception exception)
        {
            app.Logger.LogWarning(exception, "Could not open MakerNames Studio automatically. Open {Url} manually.", url);
        }
    });
}

app.Run();
