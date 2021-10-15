using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Utilities;
using DowntimeAlerter.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace DowntimeAlerter.Data
{
    public class DowntimeAlerterDbContext : DbContext
    {
        public DowntimeAlerterDbContext(DbContextOptions<DowntimeAlerterDbContext> options)
            : base(options)
        {
        }

        public DbSet<SiteEmail> SiteEmails { get; set; }
        public DbSet<Site> Sites { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<NotificationLog> NotificationLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Log>().ToTable(nameof(Logs), t => t.ExcludeFromMigrations());

            builder
                .ApplyConfiguration(new SiteEmailConfiguration());

            builder
                .ApplyConfiguration(new SiteConfiguration());

            builder
                .ApplyConfiguration(new UserConfiguration());

            builder
                .ApplyConfiguration(new NotificationConfiguration());
            //example sites 200 and 404
            builder.Entity<Site>().HasData(
                new Site {Id = 1, Name = "Google", Url = "https://google.com", IntervalTime = 40});

            builder.Entity<SiteEmail>().HasData(
                new SiteEmail {Id = 1, Email = "necipbaser71@gmail.com", SiteId = 1});

            builder.Entity<Site>().HasData(
                new Site {Id = 2, Name = "Down Site Example", Url = "https://example.org/impolite", IntervalTime = 30});

            builder.Entity<SiteEmail>().HasData(
                new SiteEmail {Id = 2, Email = "necipbaser71@gmail.com", SiteId = 2});

            var md5Password = SecurePasswordHasher.CalculateMD5Hash("4*!Vf2");
            builder.Entity<User>().HasData(
                new User {Id = 1, Name = "Necip Baser", UserName = "user", Password = md5Password}
            );
        }
    }
}