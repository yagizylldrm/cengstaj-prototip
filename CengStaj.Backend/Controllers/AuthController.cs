using CengStaj.Backend.Data;
using CengStaj.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CengStaj.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // --- ÖĞRENCİ KAYIT ENDPOINT'İ ---
        // POST: api/auth/register
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

        // --- ÖĞRENCİ GİRİŞ ENDPOINT'İ ---
        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentNo == dto.StudentNo
            );

            if (student == null)
            {
                return Unauthorized(new { message = "Öğrenci numarası veya şifre hatalı!" });
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, student.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Öğrenci numarası veya şifre hatalı!" });
            }

            return Ok(
                new
                {
                    message = "Giriş başarılı.",
                    studentNo = student.StudentNo,
                    firstName = student.FirstName,
                    lastName = student.LastName,
                }
            );
        }

        // --- ŞİFRE SIFIRLAMA TALEBİ (MOCK OTP) ---
        // POST: api/auth/forgot-password
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

            var mockOtp = new Random().Next(100000, 999999).ToString();
            return Ok(new { message = "Şifre sıfırlama kodu oluşturuldu.", otp = mockOtp });
        }

        // --- YENİ ŞİFREYİ VERİTABANINA MÜHÜRLEME ---
        // POST: api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentNo == dto.StudentNo
            );
            if (student == null)
            {
                return NotFound(new { message = "Öğrenci bulunamadı!" });
            }

            student.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifreniz başarıyla güncellendi!" });
        }

        public record ForgotPasswordDto(string StudentNo);

        public record ResetPasswordDto(string StudentNo, string NewPassword);
    }

    // --- DATA TRANSFER OBJECTS (DTOs) ---
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
