using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CengStaj.Backend.Models
{
    public class Supervisor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int InternshipId { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = null!;

        [Required]
        [StringLength(11)]
        public string Phone { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [ForeignKey("InternshipId")]
        public Internship Internship { get; set; } = null!;
    }
}
