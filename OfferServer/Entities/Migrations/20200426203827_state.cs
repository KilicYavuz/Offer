using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class state : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "RequestOffers");

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "Requests",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "RequestOffers",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "State",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "State",
                table: "RequestOffers");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Requests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "RequestOffers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
