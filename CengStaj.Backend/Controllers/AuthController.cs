using System.Collections.Concurrent; // 💡 Güvenli hafıza sözlüğü için eklendi
using System.IdentityModel.Tokens.Jwt; // 💡 JWT üretimi için eklendi
using System.Security.Claims;
using System.Security.Cryptography; // 💡 Kriptografi için eklendi
using System.Text;
using CengStaj.Backend.Data;
using CengStaj.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CengStaj.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("AuthPolicy")] // 🔒 Brute force koruması
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        // 🔒 Şifre sıfırlama kodlarını hafızada asenkron güvenli tutmak için static sözlük
        private static readonly ConcurrentDictionary<string, string> _resetCodes = new();

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // --- ÖĞRENCİ KAYIT ENDPOINT'İ ---
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!dto.StudentNo.StartsWith("20") || dto.StudentNo.Length != 9)
            {
                return BadRequest(new { message = "Geçersiz öğrenci numarası formatı!" });
            }

            bool userExists = await _context.Students.AnyAsync(s =>
                s.StudentNo == dto.StudentNo || s.TCNo == dto.TCNo
            );
            if (userExists)
            {
                return BadRequest(
                    new { message = "Bu öğrenci numarası veya T.C. Kimlik No zaten kayıtlı!" }
                );
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var student = new Student
            {
                StudentNo = dto.StudentNo,
                PasswordHash = hashedPassword,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                TCNo = dto.TCNo,
                Phone = dto.Phone,
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt işlemi başarıyla tamamlandı." });
        }

        // --- ÖĞRENCİ GİRİŞ ENDPOINT'İ (JWT TOKEN ÜRETİMLİ) ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentNo == dto.StudentNo
            );

            if (student == null || !BCrypt.Net.BCrypt.Verify(dto.Password, student.PasswordHash))
            {
                return Unauthorized(new { message = "Öğrenci numarası veya şifre hatalı!" });
            }

            // 🔒 GÜVENLİK FIX'I: Kriptografik JWT Token oluşturulması
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, student.StudentNo), // Token içerisine öğrenci no gömülüyor
                new Claim(ClaimTypes.Role, "Student"),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("CengStajVerySecureSecretKey2026!SignatureRef123456")
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "CengStajBackend",
                audience: "CengStajFrontend",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(2), // 2 Günlük güvenli oturum süresi
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(
                new
                {
                    message = "Giriş başarılı.",
                    token = tokenString, // 💡 Token ön yüze teslim ediliyor
                    studentNo = student.StudentNo,
                    firstName = student.FirstName,
                    lastName = student.LastName,
                }
            );
        }

        // --- ŞİFRE SIFIRLAMA TALEBİ ---
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentNo == dto.StudentNo
            );
            if (student == null)
            {
                return NotFound(
                    new { message = "Bu öğrenci numarasıyla kayıtlı bir kullanıcı bulunamadı!" }
                );
            }

            // 🔒 GÜVENLİK FIX'I: Kriptografik güvenli 6 haneli OTP
            var secureOtp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
            _resetCodes[dto.StudentNo] = secureOtp;

            // 🔒 GÜVENLİK FIX'I: Yanıttan kaldırıldı, sadece terminale basılıyor (Sızıntı Önleme)
            Console.WriteLine(
                $"\n[🔒 GÜVENLİK SİMÜLASYONU] {dto.StudentNo} için Şifre Sıfırlama Kodu: {secureOtp}\n"
            );

            return Ok(
                new
                {
                    message = "Şifre sıfırlama kodu oluşturuldu. Lütfen terminal dökümündeki kodu girin.",
                }
            );
        }

        // --- YENİ ŞİFREYİ VERİTABANINA MÜHÜRLEME ---
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            // 🔒 GÜVENLİK FIX'I: OTP Kodu zorunlu olarak hafızadakiyle doğrulanıyor
            if (
                !_resetCodes.TryGetValue(dto.StudentNo, out var storedOtp)
                || storedOtp != dto.OtpCode
            )
            {
                return BadRequest(
                    new { message = "Geçersiz veya süresi dolmuş şifre sıfırlama kodu!" }
                );
            }

            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentNo == dto.StudentNo
            );
            if (student == null)
            {
                return NotFound(new { message = "Öğrenci bulunamadı!" });
            }

            student.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            _resetCodes.TryRemove(dto.StudentNo, out _); // Replay attack koruması (tek kullanımlık)
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifreniz başarıyla güncellendi!" });
        }

        public record ForgotPasswordDto(string StudentNo);

        public record ResetPasswordDto(string StudentNo, string NewPassword, string OtpCode);
    }

    public record RegisterDto(
        string StudentNo,
        string Password,
        string FirstName,
        string LastName,
        string TCNo,
        string Phone
    );

    public record LoginDto(string StudentNo, string Password);
}
