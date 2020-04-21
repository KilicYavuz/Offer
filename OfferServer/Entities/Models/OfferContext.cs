using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Entities.Models
{
    public partial class OfferContext : DbContext
    {
        public OfferContext()
        {
        }

        public OfferContext(DbContextOptions<OfferContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Address> Address { get; set; }
        public virtual DbSet<Brands> Brands { get; set; }
        public virtual DbSet<Carts> Carts { get; set; }
        public virtual DbSet<Categories> Categories { get; set; }
        public virtual DbSet<ErrorLogs> ErrorLogs { get; set; }
        public virtual DbSet<Notifications> Notifications { get; set; }
        public virtual DbSet<OrderProducts> OrderProducts { get; set; }
        public virtual DbSet<Orders> Orders { get; set; }
        public virtual DbSet<ProductTags> ProductTags { get; set; }
        public virtual DbSet<Products> Products { get; set; }
        public virtual DbSet<RequestOfferProducts> RequestOfferProducts { get; set; }
        public virtual DbSet<RequestOffers> RequestOffers { get; set; }
        public virtual DbSet<RequestProducts> RequestProducts { get; set; }
        public virtual DbSet<Requests> Requests { get; set; }
        public virtual DbSet<SupplierProducts> SupplierProducts { get; set; }
        public virtual DbSet<Tags> Tags { get; set; }
        public virtual DbSet<Users> Users { get; set; }

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseSqlServer("Server=DESKTOP-F747QN4;Database=Offer;Trusted_Connection=True;");
//            }
//        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.AddressInfo)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.AddressName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.County)
                    .IsRequired()
                    .HasMaxLength(25);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.NameSurname).HasMaxLength(250);

                entity.Property(e => e.Phone).HasMaxLength(15);

                entity.Property(e => e.UserOid).HasColumnName("UserOId");

                entity.Property(e => e.ZipCode).HasMaxLength(6);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Address)
                    .HasForeignKey(d => d.UserOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Address_Users");
            });

            modelBuilder.Entity<Brands>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Carts>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerOid).HasColumnName("CustomerOId");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.SupplierOid).HasColumnName("SupplierOId");
            });

            modelBuilder.Entity<Categories>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ParentOid).HasColumnName("ParentOId");

                entity.HasOne(d => d.ParentCategory)
                    .WithMany(p => p.SubCategories)
                    .HasForeignKey(d => d.ParentOid)
                    .HasConstraintName("FK_Categories_Categories");
            });

            modelBuilder.Entity<ErrorLogs>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_dbo.ErrorLogs");

                entity.Property(e => e.Oid)
                    .HasColumnName("OId")
                    .HasDefaultValueSql("(newsequentialid())");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ErrorContext).HasMaxLength(255);

                entity.Property(e => e.ErrorSource).HasMaxLength(255);

                entity.Property(e => e.ErrorType).HasMaxLength(500);

                entity.Property(e => e.Tag).HasMaxLength(20);
            });

            modelBuilder.Entity<Notifications>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate)
                    .HasMaxLength(10)
                    .IsFixedLength();

                entity.Property(e => e.Message).HasMaxLength(255);

                entity.Property(e => e.UserOid).HasColumnName("UserOId");
            });

            modelBuilder.Entity<OrderProducts>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.OrderOid).HasColumnName("OrderOId");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.SupplierOid).HasColumnName("SupplierOId");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderProducts)
                    .HasForeignKey(d => d.OrderOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrderProducts_Orders");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.OrderProducts)
                    .HasForeignKey(d => d.ProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrderProducts_Products");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.OrderProducts)
                    .HasForeignKey(d => d.SupplierOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrderProducts_Users");
            });

            modelBuilder.Entity<Orders>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_Orders_1");

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.BillingAddresOid).HasColumnName("BillingAddresOId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerOid).HasColumnName("CustomerOId");

                entity.Property(e => e.ShippingAddressOid).HasColumnName("ShippingAddressOId");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CustomerOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Orders_Users1");
            });

            modelBuilder.Entity<ProductTags>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.TagOid).HasColumnName("TagOId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductTags)
                    .HasForeignKey(d => d.ProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProductTags_Products");

                entity.HasOne(d => d.Tags)
                    .WithMany(p => p.ProductTags)
                    .HasForeignKey(d => d.TagOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProductTags_Tags");
            });

            modelBuilder.Entity<Products>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_Products_1");

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.BrandOid).HasColumnName("BrandOId");

                entity.Property(e => e.CategoryOid).HasColumnName("CategoryOId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.VerificationCode).HasMaxLength(20);

                entity.HasOne(d => d.Brand)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.BrandOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Products_Brands");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Products_Categories");
            });

            modelBuilder.Entity<RequestOfferProducts>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.RequestOfferOid).HasColumnName("RequestOfferOId");

                entity.Property(e => e.RequestProductOid).HasColumnName("RequestProductOId");

                entity.HasOne(d => d.RequestOfferO)
                    .WithMany(p => p.RequestOfferProducts)
                    .HasForeignKey(d => d.RequestOfferOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestOfferProducts_RequestOffers");

                entity.HasOne(d => d.RequestProductO)
                    .WithMany(p => p.RequestOfferProducts)
                    .HasForeignKey(d => d.RequestProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestOfferProducts_RequestProducts");
            });

            modelBuilder.Entity<RequestOffers>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_RequestOffers_1");

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.RequestOid).HasColumnName("RequestOId");

                entity.Property(e => e.SupplierOid).HasColumnName("SupplierOId");

                entity.HasOne(d => d.Request)
                    .WithMany(p => p.RequestOffers)
                    .HasForeignKey(d => d.RequestOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestOffers_Requests");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.RequestOffers)
                    .HasForeignKey(d => d.SupplierOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestOffers_Users");
            });

            modelBuilder.Entity<RequestProducts>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.RequestOid).HasColumnName("RequestOId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.RequestProducts)
                    .HasForeignKey(d => d.ProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestProducts_Products");

                entity.HasOne(d => d.Request)
                    .WithMany(p => p.RequestProducts)
                    .HasForeignKey(d => d.RequestOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestProducts_Requests");
            });

            modelBuilder.Entity<Requests>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_Requests_1");

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerOid).HasColumnName("CustomerOId");

                entity.Property(e => e.SupplierOid).HasColumnName("SupplierOId");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.CustomerOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Requests_Users");
            });

            modelBuilder.Entity<SupplierProducts>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_SalesList");

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.SupplierOid).HasColumnName("SupplierOId");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.SupplierProducts)
                    .HasForeignKey(d => d.ProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SalesLists_Products");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.SupplierProducts)
                    .HasForeignKey(d => d.SupplierOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SalesLists_Users");
            });

            modelBuilder.Entity<Tags>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.BirthDate).HasColumnType("date");

                entity.Property(e => e.CompanyName).HasMaxLength(100);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Password).HasMaxLength(50);

                entity.Property(e => e.PhoneNumber).HasMaxLength(20);

                entity.Property(e => e.State).HasDefaultValueSql("((1))");

                entity.Property(e => e.Surname).HasMaxLength(50);

                entity.Property(e => e.Username).HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
