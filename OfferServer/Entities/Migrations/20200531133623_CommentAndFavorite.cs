using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class CommentAndFavorite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Oid = table.Column<Guid>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserOid = table.Column<Guid>(nullable: false),
                    ProductOid = table.Column<Guid>(nullable: false),
                    Comment = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_Comments_Products_ProductOid",
                        column: x => x.ProductOid,
                        principalTable: "Products",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Users_UserOid",
                        column: x => x.UserOid,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_ProductOid",
                table: "Comments",
                column: "ProductOid");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserOid",
                table: "Comments",
                column: "UserOid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");
        }
    }
}
