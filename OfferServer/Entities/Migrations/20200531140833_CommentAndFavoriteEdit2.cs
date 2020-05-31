using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class CommentAndFavoriteEdit2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Products_ProductOid",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserOid",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductOptions_Products_ProductOid",
                table: "ProductOptions");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "ProductOid",
                table: "ProductOptions",
                newName: "ProductOId");

            migrationBuilder.RenameColumn(
                name: "Oid",
                table: "ProductOptions",
                newName: "OId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductOptions_ProductOid",
                table: "ProductOptions",
                newName: "IX_ProductOptions_ProductOId");

            migrationBuilder.RenameColumn(
                name: "UserOid",
                table: "Comments",
                newName: "UserOId");

            migrationBuilder.RenameColumn(
                name: "ProductOid",
                table: "Comments",
                newName: "ProductOId");

            migrationBuilder.RenameColumn(
                name: "Oid",
                table: "Comments",
                newName: "OId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserOid",
                table: "Comments",
                newName: "IX_Comments_UserOId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ProductOid",
                table: "Comments",
                newName: "IX_Comments_ProductOId");

            migrationBuilder.AlterColumn<string>(
                name: "Option",
                table: "ProductOptions",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "ProductOptions",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Comments",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "CommentContent",
                table: "Comments",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "FavoriteLists",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserOId = table.Column<Guid>(nullable: false),
                    ListName = table.Column<string>(maxLength: 50, nullable: false),
                    State = table.Column<int>(nullable: false, defaultValueSql: "((1))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteLists", x => x.OId);
                    table.ForeignKey(
                        name: "FK_FavoriteLists_User",
                        column: x => x.UserOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FavoriteListItems",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    FavoriteListOId = table.Column<Guid>(nullable: false),
                    ProductOId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteListItems", x => x.OId);
                    table.ForeignKey(
                        name: "FK_FavoriteList_FavoriteListItems",
                        column: x => x.FavoriteListOId,
                        principalTable: "FavoriteLists",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FavoriteListItems_Products_ProductOId",
                        column: x => x.ProductOId,
                        principalTable: "Products",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteListItems_FavoriteListOId",
                table: "FavoriteListItems",
                column: "FavoriteListOId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteListItems_ProductOId",
                table: "FavoriteListItems",
                column: "ProductOId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteLists_UserOId",
                table: "FavoriteLists",
                column: "UserOId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Product",
                table: "Comments",
                column: "ProductOId",
                principalTable: "Products",
                principalColumn: "OId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_User",
                table: "Comments",
                column: "UserOId",
                principalTable: "Users",
                principalColumn: "OId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductOptions_Product",
                table: "ProductOptions",
                column: "ProductOId",
                principalTable: "Products",
                principalColumn: "OId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Product",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_User",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductOptions_Product",
                table: "ProductOptions");

            migrationBuilder.DropTable(
                name: "FavoriteListItems");

            migrationBuilder.DropTable(
                name: "FavoriteLists");

            migrationBuilder.DropColumn(
                name: "CommentContent",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "ProductOId",
                table: "ProductOptions",
                newName: "ProductOid");

            migrationBuilder.RenameColumn(
                name: "OId",
                table: "ProductOptions",
                newName: "Oid");

            migrationBuilder.RenameIndex(
                name: "IX_ProductOptions_ProductOId",
                table: "ProductOptions",
                newName: "IX_ProductOptions_ProductOid");

            migrationBuilder.RenameColumn(
                name: "UserOId",
                table: "Comments",
                newName: "UserOid");

            migrationBuilder.RenameColumn(
                name: "ProductOId",
                table: "Comments",
                newName: "ProductOid");

            migrationBuilder.RenameColumn(
                name: "OId",
                table: "Comments",
                newName: "Oid");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_UserOId",
                table: "Comments",
                newName: "IX_Comments_UserOid");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ProductOId",
                table: "Comments",
                newName: "IX_Comments_ProductOid");

            migrationBuilder.AlterColumn<string>(
                name: "Option",
                table: "ProductOptions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "ProductOptions",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Comments",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Products_ProductOid",
                table: "Comments",
                column: "ProductOid",
                principalTable: "Products",
                principalColumn: "OId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserOid",
                table: "Comments",
                column: "UserOid",
                principalTable: "Users",
                principalColumn: "OId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductOptions_Products_ProductOid",
                table: "ProductOptions",
                column: "ProductOid",
                principalTable: "Products",
                principalColumn: "OId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
