using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DowntimeAlerter.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    SiteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    NotificationType = table.Column<int>(type: "int", nullable: false),
                    CheckedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IntervalTime = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteEmails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SiteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteEmails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteEmails_Sites_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Sites",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                    name: "Logs",
                    columns: table => new
                    {
                        Id = table.Column<int>(type: "int", nullable: false)
                            .Annotation("SqlServer:Identity", "1, 1"),
                        Message = table.Column<string>(type: "nvarchar(MAX)", maxLength: int.MaxValue, nullable: true),
                        MessageTemplate = table.Column<string>(type: "nvarchar(MAX)", maxLength: int.MaxValue, nullable: true),
                        Level = table.Column<string>(type: "nvarchar(MAX)", maxLength: int.MaxValue, nullable: true),
                        TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                        Exception = table.Column<string>(type: "nvarchar(MAX)", maxLength: int.MaxValue, nullable: true),
                        Properties = table.Column<string>(type: "nvarchar(MAX)", maxLength: int.MaxValue, nullable: true)
                    });

            migrationBuilder.InsertData(
                table: "Sites",
                columns: new[] { "Id", "IntervalTime", "Name", "Url" },
                values: new object[] { 1, 20, "Google", "https://google.com" });

            migrationBuilder.InsertData(
                table: "Sites",
                columns: new[] { "Id", "IntervalTime", "Name", "Url" },
                values: new object[] { 2, 30, "Down Site Example", "https://example.org/impolite" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Name", "Password", "UserName" },
                values: new object[] { 1, "Necip Baser", "$MYHASH$V1$10000$RF6L72YL97FCEHbrmlNcTMyByddGcIDOslSZLYa5qsqgIFAw", "user" });

            migrationBuilder.InsertData(
                table: "SiteEmails",
                columns: new[] { "Id", "Email", "SiteId" },
                values: new object[] { 1, "necipbaser71@gmail.com", 1 });

            migrationBuilder.InsertData(
                table: "SiteEmails",
                columns: new[] { "Id", "Email", "SiteId" },
                values: new object[] { 2, "necipbaser71@gmail.com", 2 });

            migrationBuilder.CreateIndex(
                name: "IX_SiteEmails_SiteId",
                table: "SiteEmails",
                column: "SiteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationLogs");

            migrationBuilder.DropTable(
                name: "SiteEmails");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Sites");
        }
    }
}
