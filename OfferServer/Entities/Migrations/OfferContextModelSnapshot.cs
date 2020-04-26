﻿// <auto-generated />
using System;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Entities.Migrations
{
    [DbContext(typeof(OfferContext))]
    partial class OfferContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Entities.Models.Address", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AddressInfo")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.Property<string>("AddressName")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(20)")
                        .HasMaxLength(20);

                    b.Property<string>("County")
                        .IsRequired()
                        .HasColumnType("nvarchar(25)")
                        .HasMaxLength(25);

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("NameSurname")
                        .HasColumnType("nvarchar(250)")
                        .HasMaxLength(250);

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(15)")
                        .HasMaxLength(15);

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserOid")
                        .HasColumnName("UserOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ZipCode")
                        .HasColumnType("nvarchar(6)")
                        .HasMaxLength(6);

                    b.HasKey("Oid");

                    b.HasIndex("UserOid");

                    b.ToTable("Address");
                });

            modelBuilder.Entity("Entities.Models.Brand", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.ToTable("Brands");
                });

            modelBuilder.Entity("Entities.Models.Cart", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<Guid>("CustomerOid")
                        .HasColumnName("CustomerOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("ItemType")
                        .HasColumnType("int");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<Guid>("ProductOid")
                        .HasColumnName("ProductOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<Guid>("SupplierOid")
                        .HasColumnName("SupplierOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.ToTable("Carts");
                });

            modelBuilder.Entity("Entities.Models.Category", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<Guid?>("ParentOid")
                        .HasColumnName("ParentOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.HasIndex("ParentOid");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Entities.Models.ErrorLog", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("(newsequentialid())");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Detail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ErrorContext")
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.Property<string>("ErrorMessage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ErrorSource")
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.Property<string>("ErrorType")
                        .HasColumnType("nvarchar(500)")
                        .HasMaxLength(500);

                    b.Property<string>("StackTrace")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Tag")
                        .HasColumnType("nvarchar(20)")
                        .HasMaxLength(20);

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid")
                        .HasName("PK_dbo.ErrorLogs");

                    b.ToTable("ErrorLogs");
                });

            modelBuilder.Entity("Entities.Models.Notification", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2")
                        .IsFixedLength(true)
                        .HasMaxLength(10);

                    b.Property<string>("Message")
                        .HasColumnType("nvarchar(255)")
                        .HasMaxLength(255);

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserOid")
                        .HasColumnName("UserOId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Oid");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("Entities.Models.Order", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("BillingAddresOid")
                        .HasColumnName("BillingAddresOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<Guid>("CustomerOid")
                        .HasColumnName("CustomerOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("PaymentState")
                        .HasColumnType("bit");

                    b.Property<int>("PaymentType")
                        .HasColumnType("int");

                    b.Property<Guid>("ShippingAddressOid")
                        .HasColumnName("ShippingAddressOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<double>("TotalPrice")
                        .HasColumnType("float");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid")
                        .HasName("PK_Orders");

                    b.HasIndex("CustomerOid");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("Entities.Models.OrderProduct", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<int>("ItemType")
                        .HasColumnType("int");

                    b.Property<Guid>("OrderOid")
                        .HasColumnName("OrderOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<Guid>("ProductOid")
                        .HasColumnName("ProductOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<Guid>("SupplierOid")
                        .HasColumnName("SupplierOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.HasIndex("OrderOid");

                    b.HasIndex("ProductOid");

                    b.HasIndex("SupplierOid");

                    b.ToTable("OrderProducts");
                });

            modelBuilder.Entity("Entities.Models.Product", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BrandOid")
                        .HasColumnName("BrandOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CategoryOid")
                        .HasColumnName("CategoryOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<string>("ShortDescription")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<int>("Stock")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("VerificationCode")
                        .HasColumnType("nvarchar(20)")
                        .HasMaxLength(20);

                    b.Property<bool>("Verified")
                        .HasColumnType("bit");

                    b.HasKey("Oid")
                        .HasName("PK_Products");

                    b.HasIndex("BrandOid");

                    b.HasIndex("CategoryOid");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("Entities.Models.ProductOptions", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Option")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("ProductOid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.HasIndex("ProductOid");

                    b.ToTable("ProductOptions");
                });

            modelBuilder.Entity("Entities.Models.ProductTag", b =>
                {
                    b.Property<Guid>("ProductOid")
                        .HasColumnName("ProductOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("TagOid")
                        .HasColumnName("TagOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("ProductOid", "TagOid");

                    b.HasIndex("TagOid");

                    b.ToTable("ProductTags");
                });

            modelBuilder.Entity("Entities.Models.Request", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("CanPartial")
                        .HasColumnType("bit");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<Guid>("CustomerOid")
                        .HasColumnName("CustomerOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<Guid?>("SupplierOid")
                        .HasColumnName("SupplierOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid")
                        .HasName("PK_Requests");

                    b.HasIndex("CustomerOid");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("Entities.Models.RequestOffer", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime")
                        .HasDefaultValueSql("(getdate())");

                    b.Property<bool>("IsPartialOffer")
                        .HasColumnType("bit");

                    b.Property<Guid>("RequestOid")
                        .HasColumnName("RequestOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<int>("SupplierDisplayId")
                        .HasColumnType("int");

                    b.Property<Guid>("SupplierOid")
                        .HasColumnName("SupplierOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid")
                        .HasName("PK_RequestOffers");

                    b.HasIndex("RequestOid");

                    b.HasIndex("SupplierOid");

                    b.ToTable("RequestOffers");
                });

            modelBuilder.Entity("Entities.Models.RequestOfferProduct", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<double?>("OfferedPrice")
                        .HasColumnType("float");

                    b.Property<int?>("OfferedQuantity")
                        .HasColumnType("int");

                    b.Property<Guid>("RequestOfferOid")
                        .HasColumnName("RequestOfferOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RequestProductOid")
                        .HasColumnName("RequestProductOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.HasIndex("RequestOfferOid");

                    b.HasIndex("RequestProductOid");

                    b.ToTable("RequestOfferProducts");
                });

            modelBuilder.Entity("Entities.Models.RequestProduct", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<bool>("IsPartial")
                        .HasColumnType("bit");

                    b.Property<Guid>("ProductOid")
                        .HasColumnName("ProductOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<Guid>("RequestOid")
                        .HasColumnName("RequestOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.HasIndex("ProductOid");

                    b.HasIndex("RequestOid");

                    b.ToTable("RequestProducts");
                });

            modelBuilder.Entity("Entities.Models.SupplierProduct", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("Price")
                        .HasColumnType("float");

                    b.Property<Guid>("ProductOid")
                        .HasColumnName("ProductOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<Guid>("SupplierOid")
                        .HasColumnName("SupplierOId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid")
                        .HasName("PK_SalesList");

                    b.HasIndex("ProductOid");

                    b.HasIndex("SupplierOid");

                    b.ToTable("SupplierProducts");
                });

            modelBuilder.Entity("Entities.Models.Tag", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<int>("State")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Oid");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("Entities.Models.User", b =>
                {
                    b.Property<Guid>("Oid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("OId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("BirthDate")
                        .HasColumnType("date");

                    b.Property<string>("CompanyName")
                        .HasColumnType("nvarchar(100)")
                        .HasMaxLength(100);

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(20)")
                        .HasMaxLength(20);

                    b.Property<int>("State")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValueSql("((1))");

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserType")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.HasKey("Oid");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Entities.Models.Address", b =>
                {
                    b.HasOne("Entities.Models.User", "User")
                        .WithMany("Address")
                        .HasForeignKey("UserOid")
                        .HasConstraintName("FK_Address_Users")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.Category", b =>
                {
                    b.HasOne("Entities.Models.Category", "ParentCategory")
                        .WithMany("SubCategories")
                        .HasForeignKey("ParentOid")
                        .HasConstraintName("FK_Categories_Categories");
                });

            modelBuilder.Entity("Entities.Models.Order", b =>
                {
                    b.HasOne("Entities.Models.User", "Customer")
                        .WithMany("Orders")
                        .HasForeignKey("CustomerOid")
                        .HasConstraintName("FK_Orders_Users")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.OrderProduct", b =>
                {
                    b.HasOne("Entities.Models.Order", "Order")
                        .WithMany("OrderProducts")
                        .HasForeignKey("OrderOid")
                        .HasConstraintName("FK_OrderProducts_Orders")
                        .IsRequired();

                    b.HasOne("Entities.Models.Product", "Product")
                        .WithMany("OrderProducts")
                        .HasForeignKey("ProductOid")
                        .HasConstraintName("FK_OrderProducts_Products")
                        .IsRequired();

                    b.HasOne("Entities.Models.User", "Supplier")
                        .WithMany("OrderProducts")
                        .HasForeignKey("SupplierOid")
                        .HasConstraintName("FK_OrderProducts_Users")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.Product", b =>
                {
                    b.HasOne("Entities.Models.Brand", "Brand")
                        .WithMany("Products")
                        .HasForeignKey("BrandOid")
                        .HasConstraintName("FK_Products_Brands")
                        .IsRequired();

                    b.HasOne("Entities.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryOid")
                        .HasConstraintName("FK_Products_Categories")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.ProductOptions", b =>
                {
                    b.HasOne("Entities.Models.Product", "Product")
                        .WithMany("ProductOptions")
                        .HasForeignKey("ProductOid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.ProductTag", b =>
                {
                    b.HasOne("Entities.Models.Product", "Product")
                        .WithMany("ProductTags")
                        .HasForeignKey("ProductOid")
                        .HasConstraintName("FK_ProductTags_Products")
                        .IsRequired();

                    b.HasOne("Entities.Models.Tag", "Tag")
                        .WithMany("ProductTags")
                        .HasForeignKey("TagOid")
                        .HasConstraintName("FK_ProductTags_Tags")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.Request", b =>
                {
                    b.HasOne("Entities.Models.User", "Customer")
                        .WithMany("Requests")
                        .HasForeignKey("CustomerOid")
                        .HasConstraintName("FK_Requests_Users")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.RequestOffer", b =>
                {
                    b.HasOne("Entities.Models.Request", "Request")
                        .WithMany("RequestOffers")
                        .HasForeignKey("RequestOid")
                        .HasConstraintName("FK_RequestOffers_Requests")
                        .IsRequired();

                    b.HasOne("Entities.Models.User", "Supplier")
                        .WithMany("RequestOffers")
                        .HasForeignKey("SupplierOid")
                        .HasConstraintName("FK_RequestOffers_Users")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.RequestOfferProduct", b =>
                {
                    b.HasOne("Entities.Models.RequestOffer", "RequestOffer")
                        .WithMany("RequestOfferProducts")
                        .HasForeignKey("RequestOfferOid")
                        .HasConstraintName("FK_RequestOfferProducts_RequestOffers")
                        .IsRequired();

                    b.HasOne("Entities.Models.RequestProduct", "RequestProduct")
                        .WithMany("RequestOfferProducts")
                        .HasForeignKey("RequestProductOid")
                        .HasConstraintName("FK_RequestOfferProducts_RequestProducts")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.RequestProduct", b =>
                {
                    b.HasOne("Entities.Models.Product", "Product")
                        .WithMany("RequestProducts")
                        .HasForeignKey("ProductOid")
                        .HasConstraintName("FK_RequestProducts_Products")
                        .IsRequired();

                    b.HasOne("Entities.Models.Request", "Request")
                        .WithMany("RequestProducts")
                        .HasForeignKey("RequestOid")
                        .HasConstraintName("FK_RequestProducts_Requests")
                        .IsRequired();
                });

            modelBuilder.Entity("Entities.Models.SupplierProduct", b =>
                {
                    b.HasOne("Entities.Models.Product", "Product")
                        .WithMany("SupplierProducts")
                        .HasForeignKey("ProductOid")
                        .HasConstraintName("FK_SalesLists_Products")
                        .IsRequired();

                    b.HasOne("Entities.Models.User", "Supplier")
                        .WithMany("SupplierProducts")
                        .HasForeignKey("SupplierOid")
                        .HasConstraintName("FK_SalesLists_Users")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
