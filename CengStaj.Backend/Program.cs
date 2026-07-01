using System.Text;
using System.Threading.RateLimiting;
using CengStaj.Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer; // 💡 JWT için eklendi
using Microsoft.AspNetCore.Http; // 💡 StatusCodes için eklendi
using Microsoft.AspNetCore.RateLimiting; // 💡 Rate Limiting için eklendi
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; // 💡 JWT için eklendi
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// 🔒 GÜVENLİK FIX'I: Kaba kuvvet saldırılarına karşı Rate Limiting (Dakikada maks 5 istek)
builder.Services.AddRateLimiter(options =>
{
    // 💡 KRİTİK GÜVENLİK FIX'I: .NET varsayılan olarak 503 döner.
    // Ön yüzdeki rate limit kontrolünün tetiklenebilmesi için bunu resmi olarak 429 yapıyoruz!
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter(
        "AuthPolicy",
        opt =>
        {
            opt.PermitLimit = 5;
            opt.Window = TimeSpan.FromMinutes(1);
            opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            opt.QueueLimit = 0;
        }
    );
});

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System
            .Text
            .Json
            .Serialization
            .ReferenceHandler
            .IgnoreCycles;
    });

// 🔒 GÜVENLİK FIX'I: JWT Kimlik Doğrulama Katmanının Tanımlanması
var jwtKey = "CengStajVerySecureSecretKey2026!SignatureRef123456"; // En az 32 karakter olmalıdır
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "CengStajBackend",
            ValidAudience = "CengStajFrontend",
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddOpenApi();

string connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Veritabanı bağlantı dizesi 'DefaultConnection' bulunamadı."
    );

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReact",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("CENG Staj Bilgi Sistemi API");
        options.WithTheme(ScalarTheme.DeepSpace);
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");

// 💡 KRİTİK: Sıralama çok önemlidir!
app.UseRateLimiter();
app.UseAuthentication(); // 🔒 Kimlik doğrulama aktif
app.UseAuthorization(); // 🔒 Yetkilendirme aktif

app.MapControllers();

app.Run();
