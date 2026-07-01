using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;

namespace CengStaj.Backend.Models
{
    public class Student
    {
        [Key]
        [StringLength(9, MinimumLength = 9)]
        public String StudentNo { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = null!;

        [Required]
        [StringLength(11, MinimumLength = 11)]
        public string TCNo { get; set; } = null!;

        [Required]
        [StringLength(11, MinimumLength = 11)]
        public string Phone { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Internship> Internships { get; set; } = new List<Internship>();
    }
}
