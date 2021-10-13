using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Data.Configurations
{
    public class SiteConfiguration : IEntityTypeConfiguration<Site>
    {
        public void Configure(EntityTypeBuilder<Site> builder)
        {
            //builder
            //    .HasKey(a => a.Id);

            //builder
            //    .Property(m => m.Id)
            //    .UseIdentityColumn();

            //builder
            //    .Property(m => m.Name)
            //    .IsRequired()
            //    .HasMaxLength(50);

            //builder
            //    .ToTable("Artists");
        }
    }
}
