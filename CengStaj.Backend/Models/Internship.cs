using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CengStaj.Backend.Models
{
    public class Internship
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string StudentNo { get; set; } = null!;

        [Required]
        [StringLength(9)]
        public string AcademicYear { get; set; } = null!;

        [Required]
        [StringLength(10)]
        public string CourseCode { get; set; } = null!;

        [Required]
        [StringLength(10)]
        public string InternshipType { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string CompanyName { get; set; } = null!;

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }

        public bool UnemploymentFundDeclared { get; set; } = false;

        public int CurrentStep { get; set; } = 1;

        public bool IsFinalized { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("StudentNo")]
        public Student Student { get; set; } = null!;

        public Supervisor? Supervisor { get; set; }
    }
}
