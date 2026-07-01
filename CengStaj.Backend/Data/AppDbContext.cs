using CengStaj.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CengStaj.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<Internship> Internships { get; set; } = null!;
        public DbSet<Supervisor> Supervisors { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Internship>().HasIndex(i => i.CourseCode);

            modelBuilder.Entity<Internship>().HasIndex(i => i.StudentNo);

            modelBuilder
                .Entity<Supervisor>()
                .HasOne(s => s.Internship)
                .WithOne(i => i.Supervisor)
                .HasForeignKey<Supervisor>(s => s.InternshipId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
