using Microsoft.EntityFrameworkCore;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Data.Configurations;
using System;
using System.Collections.Generic;
using System.Text;

namespace DowntimeAlerter.Data
{
    public class DowntimeAlerterDbContext : DbContext
    {
        public DbSet<SiteEmail> SiteEmails { get; set; }
        public DbSet<Site> Sites { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Log> Logs { get; set; }

        public DowntimeAlerterDbContext(DbContextOptions<DowntimeAlerterDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Log>().ToTable(nameof(Logs), t => t.ExcludeFromMigrations());

            builder
                .ApplyConfiguration(new SiteEmailConfiguration());

            builder
                .ApplyConfiguration(new SiteConfiguration());

            builder
                .ApplyConfiguration(new UserConfiguration());

            builder.Entity<User>().HasData(
                new User { Id = 1, Name = "Necip Baser", UserName = "user", Password = "1234" }
            );
        }
    }
}
