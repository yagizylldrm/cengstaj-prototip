using CengStaj.Backend.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL UTC zaman dilimi yapılandırması
// Postgres ile konuşurken tüm DateTime nesnelerini otomatik olarak UTC kabul eder.
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Nesne döngülerini otomatik olarak kırar ve JSON çökmelerini önler
        options.JsonSerializerOptions.ReferenceHandler = System
            .Text
            .Json
            .Serialization
            .ReferenceHandler
            .IgnoreCycles;
    });

// .NET 10 NATIVE OPENAPI DESTEĞİ (Eski SwaggerGen yerine)
builder.Services.AddOpenApi();

// Güvenli bağlantı dizesi kontrolü
string connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Veritabanı bağlantı dizesi 'DefaultConnection' bulunamadı."
    );

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// React Frontend Bağlantısı İçin CORS Politikası
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
    // .NET 10 Yerel OpenAPI JSON çıktısını haritalar (/openapi/v1.json)
    app.MapOpenApi();

    // Scalar API Playground arayüzünü aktif eder
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("CENG Staj Bilgi Sistemi API");
        options.WithTheme(ScalarTheme.DeepSpace);
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

app.Run();
