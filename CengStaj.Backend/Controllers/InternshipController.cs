using CengStaj.Backend.Data;
using CengStaj.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CengStaj.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InternshipController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InternshipController(AppDbContext context)
        {
            _context = context;
        }

        // --- ÖĞRENCİNİN AKTİF STAJ DURUMUNU VE PROFİLİNİ GETİRME ---
        // GET: api/internship/student/{studentNo}
        [HttpGet("student/{studentNo}")]
        public async Task<IActionResult> GetStudentInternship(string studentNo)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.StudentNo == studentNo
            );
            if (student == null)
            {
                return NotFound(new { message = "Öğrenci bulunamadı!" });
            }

            var internship = await _context
                .Internships.Include(i => i.Supervisor)
                .FirstOrDefaultAsync(i => i.StudentNo == studentNo);

            return Ok(
                new
                {
                    studentProfile = new
                    {
                        studentNo = student.StudentNo,
                        firstName = student.FirstName,
                        lastName = student.LastName,
                        tcNo = student.TCNo,
                        phone = student.Phone,
                    },
                    hasApplication = internship != null,
                    data = internship,
                }
            );
        }

        // --- ADIMSAL STAJ VERİSİ KAYDETME / GÜNCELLEME (UPSERT) ---
        // POST: api/internship/save-step
        [HttpPost("save-step")]
        public async Task<IActionResult> SaveStep([FromBody] SaveStepDto dto)
        {
            if (dto.StartDate.HasValue)
            {
                if (dto.StartDate.Value.Date < DateTime.UtcNow.Date)
                {
                    return BadRequest(
                        new { message = "Staj başlangıç tarihi geçmiş bir tarih olamaz!" }
                    );
                }

                if (dto.EndDate.HasValue && dto.EndDate.Value.Date <= dto.StartDate.Value.Date)
                {
                    return BadRequest(
                        new
                        {
                            message = "Staj bitiş tarihi, başlangıç tarihinden sonraki bir gün olmalıdır!",
                        }
                    );
                }
            }
            var student = await _context.Students.AnyAsync(s => s.StudentNo == dto.StudentNo);
            if (!student)
                return BadRequest(new { message = "Öğrenci bulunamadı!" });

            var internship = await _context
                .Internships.Include(i => i.Supervisor)
                .FirstOrDefaultAsync(i =>
                    i.StudentNo == dto.StudentNo && i.CourseCode == dto.CourseCode
                );

            if (internship != null && internship.IsFinalized)
            {
                return BadRequest(
                    new
                    {
                        message = "Bu staj başvurusu onaylanmış ve kilitlenmiştir. Düzenlenemez!",
                    }
                );
            }

            if (internship == null)
            {
                internship = new Internship
                {
                    StudentNo = dto.StudentNo,
                    AcademicYear = dto.AcademicYear,
                    CourseCode = dto.CourseCode,
                    InternshipType = dto.InternshipType,
                    CompanyName = dto.CompanyName,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    CurrentStep = dto.TargetStep,
                };
                _context.Internships.Add(internship);
            }
            else
            {
                internship.AcademicYear = dto.AcademicYear;
                internship.InternshipType = dto.InternshipType;
                internship.CompanyName = dto.CompanyName;
                internship.StartDate = dto.StartDate;
                internship.EndDate = dto.EndDate;

                if (dto.TargetStep > internship.CurrentStep)
                {
                    internship.CurrentStep = dto.TargetStep;
                }
            }

            if (dto.Supervisor != null)
            {
                if (internship.Supervisor == null)
                {
                    internship.Supervisor = new Supervisor
                    {
                        FirstName = dto.Supervisor.FirstName,
                        LastName = dto.Supervisor.LastName,
                        Phone = dto.Supervisor.Phone,
                        Email = dto.Supervisor.Email,
                    };
                }
                else
                {
                    internship.Supervisor.FirstName = dto.Supervisor.FirstName;
                    internship.Supervisor.LastName = dto.Supervisor.LastName;
                    internship.Supervisor.Phone = dto.Supervisor.Phone;
                    internship.Supervisor.Email = dto.Supervisor.Email;
                }
            }

            if (dto.UnemploymentFundDeclared.HasValue)
            {
                internship.UnemploymentFundDeclared = dto.UnemploymentFundDeclared.Value;
            }

            await _context.SaveChangesAsync();
            return Ok(
                new
                {
                    message = "Adım başarıyla kaydedildi.",
                    internshipId = internship.Id,
                    currentStep = internship.CurrentStep,
                }
            );
        }

        // --- BAŞVURUYU RESMİ OLARAK KİLİTLEME (FINALIZE) ---
        // POST: api/internship/finalize/{id}
        [HttpPost("finalize/{id}")]
        public async Task<IActionResult> FinalizeApplication(int id)
        {
            var internship = await _context.Internships.FindAsync(id);
            if (internship == null)
                return NotFound(new { message = "Staj kaydı bulunamadı." });

            internship.IsFinalized = true;
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    message = "Staj başvurusu başarıyla kilitlendi ve komisyon onay havuzuna gönderildi.",
                }
            );
        }

        // --- YÖNETİM KONSOLU: FİRMA ADI VE TARİH GÜNCELLEME ---
        // PUT: api/internship/update-company
        [HttpPut("update-company")]
        public async Task<IActionResult> UpdateCompany([FromBody] UpdateCompanyDto dto)
        {
            var internship = await _context.Internships.FirstOrDefaultAsync(i =>
                i.StudentNo == dto.StudentNo
            );
            if (internship == null)
            {
                return NotFound(new { message = "Staj kaydı bulunamadı!" });
            }

            if (
                dto.StartDate.HasValue
                && dto.EndDate.HasValue
                && dto.EndDate.Value.Date <= dto.StartDate.Value.Date
            )
            {
                return BadRequest(
                    new
                    {
                        message = "Staj bitiş tarihi, başlangıç tarihinden sonraki bir gün olmalıdır!",
                    }
                );
            }

            internship.CompanyName = dto.CompanyName;
            // Npgsql UTC zaman dilimi koruması
            internship.StartDate = dto.StartDate.HasValue
                ? dto.StartDate.Value.ToUniversalTime()
                : null;
            internship.EndDate = dto.EndDate.HasValue ? dto.EndDate.Value.ToUniversalTime() : null;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Firma ve tarih bilgileri başarıyla güncellendi!" });
        }

        // --- YÖNETİM KONSOLU: STAJ AMİRİ TÜM BİLGİLERİNİ GÜNCELLEME ---
        // PUT: api/internship/update-supervisor
        [HttpPut("update-supervisor")]
        public async Task<IActionResult> UpdateSupervisor([FromBody] UpdateSupervisorDto dto)
        {
            var internship = await _context
                .Internships.Include(i => i.Supervisor)
                .FirstOrDefaultAsync(i => i.StudentNo == dto.StudentNo);

            if (internship == null || internship.Supervisor == null)
            {
                return NotFound(new { message = "Staj veya amir kaydı bulunamadı!" });
            }

            internship.Supervisor.FirstName = dto.FirstName;
            internship.Supervisor.LastName = dto.LastName;
            internship.Supervisor.Phone = dto.Phone;
            internship.Supervisor.Email = dto.Email;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Amir iletişim ve kimlik bilgileri başarıyla güncellendi!" });
        }

        public record UpdateCompanyDto(
            string StudentNo,
            string CompanyName,
            DateTime? StartDate,
            DateTime? EndDate
        );

        public record UpdateSupervisorDto(
            string StudentNo,
            string FirstName,
            string LastName,
            string Phone,
            string Email
        );
    }

    // --- STAJ ADIM TRANSFER OBJELERİ (DTOs) ---
    public record SaveStepDto(
        string StudentNo,
        string AcademicYear,
        string CourseCode,
        string InternshipType,
        string CompanyName,
        DateTime? StartDate,
        DateTime? EndDate,
        int TargetStep,
        bool? UnemploymentFundDeclared,
        SupervisorDto? Supervisor
    );

    public record SupervisorDto(string FirstName, string LastName, string Phone, string Email);
}
