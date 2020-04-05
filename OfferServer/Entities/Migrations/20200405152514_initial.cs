using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Entities.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    Image = table.Column<byte[]>(type: "image", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.OId);
                });

            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    CustomerOId = table.Column<int>(nullable: false),
                    SupplierOId = table.Column<int>(nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    ProductOId = table.Column<Guid>(nullable: false),
                    ItemType = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.OId);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Type = table.Column<int>(nullable: false),
                    ParentOId = table.Column<int>(nullable: true),
                    Image = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.OId);
                    table.ForeignKey(
                        name: "FK_Categories_Categories",
                        column: x => x.ParentOId,
                        principalTable: "Categories",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ErrorLogs",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false, defaultValueSql: "(newsequentialid())"),
                    ErrorContext = table.Column<string>(maxLength: 255, nullable: true),
                    ErrorMessage = table.Column<string>(nullable: true),
                    ErrorSource = table.Column<string>(maxLength: 255, nullable: true),
                    StackTrace = table.Column<string>(nullable: true),
                    Detail = table.Column<string>(nullable: true),
                    ErrorType = table.Column<string>(maxLength: 500, nullable: true),
                    Tag = table.Column<string>(maxLength: 20, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dbo.ErrorLogs", x => x.OId);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    UserOId = table.Column<int>(nullable: false),
                    Message = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedDate = table.Column<string>(fixedLength: true, maxLength: 10, nullable: true),
                    State = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.OId);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.OId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Surname = table.Column<string>(maxLength: 50, nullable: true),
                    CompanyName = table.Column<string>(maxLength: 100, nullable: true),
                    Username = table.Column<string>(maxLength: 50, nullable: true),
                    Email = table.Column<string>(maxLength: 50, nullable: false),
                    Password = table.Column<string>(maxLength: 50, nullable: true),
                    BirthDate = table.Column<DateTime>(type: "date", nullable: true),
                    State = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    UserType = table.Column<int>(nullable: false),
                    PhoneNumber = table.Column<string>(maxLength: 20, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.OId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    BrandOId = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    State = table.Column<int>(nullable: false),
                    CategoryOId = table.Column<int>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    Stock = table.Column<int>(nullable: false),
                    Verified = table.Column<bool>(nullable: false),
                    VerificationCode = table.Column<string>(maxLength: 20, nullable: true),
                    Image = table.Column<byte[]>(type: "image", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products_1", x => x.OId);
                    table.ForeignKey(
                        name: "FK_Products_Brands",
                        column: x => x.BrandOId,
                        principalTable: "Brands",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Products_Categories",
                        column: x => x.CategoryOId,
                        principalTable: "Categories",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Address",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserOId = table.Column<int>(nullable: false),
                    AddressName = table.Column<string>(maxLength: 50, nullable: false),
                    NameSurname = table.Column<string>(maxLength: 250, nullable: true),
                    AddressInfo = table.Column<string>(maxLength: 255, nullable: false),
                    City = table.Column<string>(maxLength: 20, nullable: false),
                    County = table.Column<string>(maxLength: 25, nullable: false),
                    ZipCode = table.Column<string>(maxLength: 6, nullable: true),
                    Phone = table.Column<string>(maxLength: 15, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Address", x => x.OId);
                    table.ForeignKey(
                        name: "FK_Address_Users",
                        column: x => x.UserOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    CustomerOId = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    State = table.Column<int>(nullable: false),
                    PaymentState = table.Column<bool>(nullable: false),
                    PaymentType = table.Column<int>(nullable: false),
                    TotalPrice = table.Column<double>(nullable: false),
                    ShippingAddressOId = table.Column<int>(nullable: false),
                    BillingAddresOId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders_1", x => x.OId);
                    table.ForeignKey(
                        name: "FK_Orders_Users1",
                        column: x => x.CustomerOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Requests",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    CustomerOId = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    CanPartial = table.Column<bool>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    SupplierOId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requests_1", x => x.OId);
                    table.ForeignKey(
                        name: "FK_Requests_Users",
                        column: x => x.CustomerOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductTags",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TagOId = table.Column<int>(nullable: false),
                    ProductOId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTags", x => x.OId);
                    table.ForeignKey(
                        name: "FK_ProductTags_Products",
                        column: x => x.ProductOId,
                        principalTable: "Products",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductTags_Tags",
                        column: x => x.TagOId,
                        principalTable: "Tags",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupplierProducts",
                columns: table => new
                {
                    OId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierOId = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    State = table.Column<bool>(nullable: false),
                    Price = table.Column<double>(nullable: true),
                    ProductOId = table.Column<Guid>(nullable: false),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesList", x => x.OId);
                    table.ForeignKey(
                        name: "FK_SalesLists_Products",
                        column: x => x.ProductOId,
                        principalTable: "Products",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SalesLists_Users",
                        column: x => x.SupplierOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderProducts",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    OrderOId = table.Column<Guid>(nullable: false),
                    SupplierOId = table.Column<int>(nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    ProductOId = table.Column<Guid>(nullable: false),
                    ItemType = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderProducts", x => x.OId);
                    table.ForeignKey(
                        name: "FK_OrderProducts_Orders",
                        column: x => x.OrderOId,
                        principalTable: "Orders",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderProducts_Products",
                        column: x => x.ProductOId,
                        principalTable: "Products",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderProducts_Users",
                        column: x => x.SupplierOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequestOffers",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    SupplierOId = table.Column<int>(nullable: false),
                    SupplierDisplayId = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    IsPartialOffer = table.Column<bool>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    RequestOId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestOffers_1", x => x.OId);
                    table.ForeignKey(
                        name: "FK_RequestOffers_Requests",
                        column: x => x.RequestOId,
                        principalTable: "Requests",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequestOffers_Users",
                        column: x => x.SupplierOId,
                        principalTable: "Users",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequestProducts",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    Quantity = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsPartial = table.Column<bool>(nullable: false),
                    ProductOId = table.Column<Guid>(nullable: false),
                    RequestOId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestProducts", x => x.OId);
                    table.ForeignKey(
                        name: "FK_RequestProducts_Products",
                        column: x => x.ProductOId,
                        principalTable: "Products",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequestProducts_Requests",
                        column: x => x.RequestOId,
                        principalTable: "Requests",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequestOfferProducts",
                columns: table => new
                {
                    OId = table.Column<Guid>(nullable: false),
                    RequestProductOId = table.Column<Guid>(nullable: false),
                    RequestOfferOId = table.Column<Guid>(nullable: false),
                    OfferedPrice = table.Column<double>(nullable: true),
                    OfferedQuantity = table.Column<int>(nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestOfferProducts", x => x.OId);
                    table.ForeignKey(
                        name: "FK_RequestOfferProducts_RequestOffers",
                        column: x => x.RequestOfferOId,
                        principalTable: "RequestOffers",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequestOfferProducts_RequestProducts",
                        column: x => x.RequestProductOId,
                        principalTable: "RequestProducts",
                        principalColumn: "OId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Address_UserOId",
                table: "Address",
                column: "UserOId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentOId",
                table: "Categories",
                column: "ParentOId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_OrderOId",
                table: "OrderProducts",
                column: "OrderOId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_ProductOId",
                table: "OrderProducts",
                column: "ProductOId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_SupplierOId",
                table: "OrderProducts",
                column: "SupplierOId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerOId",
                table: "Orders",
                column: "CustomerOId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_BrandOId",
                table: "Products",
                column: "BrandOId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryOId",
                table: "Products",
                column: "CategoryOId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTags_ProductOId",
                table: "ProductTags",
                column: "ProductOId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductTags_TagOId",
                table: "ProductTags",
                column: "TagOId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestOfferProducts_RequestOfferOId",
                table: "RequestOfferProducts",
                column: "RequestOfferOId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestOfferProducts_RequestProductOId",
                table: "RequestOfferProducts",
                column: "RequestProductOId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestOffers_RequestOId",
                table: "RequestOffers",
                column: "RequestOId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestOffers_SupplierOId",
                table: "RequestOffers",
                column: "SupplierOId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestProducts_ProductOId",
                table: "RequestProducts",
                column: "ProductOId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestProducts_RequestOId",
                table: "RequestProducts",
                column: "RequestOId");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_CustomerOId",
                table: "Requests",
                column: "CustomerOId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierProducts_ProductOId",
                table: "SupplierProducts",
                column: "ProductOId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierProducts_SupplierOId",
                table: "SupplierProducts",
                column: "SupplierOId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "ErrorLogs");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "OrderProducts");

            migrationBuilder.DropTable(
                name: "ProductTags");

            migrationBuilder.DropTable(
                name: "RequestOfferProducts");

            migrationBuilder.DropTable(
                name: "SupplierProducts");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "RequestOffers");

            migrationBuilder.DropTable(
                name: "RequestProducts");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Requests");

            migrationBuilder.DropTable(
                name: "Brands");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
