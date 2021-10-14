using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Data.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<NotificationLog>
    {
        public void Configure(EntityTypeBuilder<NotificationLog> builder)
        {
            builder
                .HasKey(m => m.Id);

            builder
                .Property(m => m.Id)
                .UseIdentityColumn();

            builder
                .Property(m => m.CheckedDate)
                .IsRequired();
            builder
                .Property(m => m.Message)
                .IsRequired()
                .HasMaxLength(2000);

            builder
                .Property(m => m.SiteName)
                .IsRequired()
                .HasMaxLength(300);

            builder
                .Property(m => m.State)
                .IsRequired()
                .HasMaxLength(100);

            builder
                .Property(m => m.NotificationType)
                .IsRequired();
            builder
                .ToTable("NotificationLogs");
        }
    }

}
