using Microsoft.EntityFrameworkCore;

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
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<FavoriteList> FavoriteLists { get; set; }
        public virtual DbSet<FavoriteListItem> FavoriteListItems { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<CartItem> CartItems { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<ErrorLog> ErrorLogs { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<OrderProduct> OrderProducts { get; set; }
        public virtual DbSet<ProductOption> ProductOptions { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<ProductTag> ProductTags { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<RequestOfferProduct> RequestOfferProducts { get; set; }
        public virtual DbSet<RequestOffer> RequestOffers { get; set; }
        public virtual DbSet<RequestProduct> RequestProducts { get; set; }
        public virtual DbSet<Request> Requests { get; set; }
        public virtual DbSet<SupplierProduct> SupplierProducts { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<User> Users { get; set; }

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

            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerOid).HasColumnName("CustomerOId");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.SupplierOid).HasColumnName("SupplierOId");
            });

            modelBuilder.Entity<Category>(entity =>
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

            modelBuilder.Entity<ErrorLog>(entity =>
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

            modelBuilder.Entity<Notification>(entity =>
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

            modelBuilder.Entity<OrderProduct>(entity =>
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

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_Orders");

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
                    .HasConstraintName("FK_Orders_Users");
            });

            modelBuilder.Entity<ProductTag>(entity =>
            {
                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");
                entity.Property(e => e.TagOid).HasColumnName("TagOId");

                entity.HasKey(pt => new { pt.ProductOid, pt.TagOid });

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductTags)
                    .HasForeignKey(d => d.ProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProductTags_Products");

                entity.HasOne(d => d.Tag)
                    .WithMany(p => p.ProductTags)
                    .HasForeignKey(d => d.TagOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProductTags_Tags");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_Products");

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

            modelBuilder.Entity<RequestOfferProduct>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid)
                    .HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.RequestOfferOid).HasColumnName("RequestOfferOId");

                entity.Property(e => e.RequestProductOid).HasColumnName("RequestProductOId");

                entity.HasOne(d => d.RequestOffer)
                    .WithMany(p => p.RequestOfferProducts)
                    .HasForeignKey(d => d.RequestOfferOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestOfferProducts_RequestOffers");

                entity.HasOne(d => d.RequestProduct)
                    .WithMany(p => p.RequestOfferProducts)
                    .HasForeignKey(d => d.RequestProductOid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RequestOfferProducts_RequestProducts");
            });

            modelBuilder.Entity<RequestOffer>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_RequestOffers");

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

            modelBuilder.Entity<RequestProduct>(entity =>
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

            modelBuilder.Entity<Request>(entity =>
            {
                entity.HasKey(e => e.Oid)
                    .HasName("PK_Requests");

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

            modelBuilder.Entity<SupplierProduct>(entity =>
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

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<User>(entity =>
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

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CommentContent)
                    .IsRequired()
                    .HasMaxLength(1000);

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.Property(e => e.UserOid).HasColumnName("UserOId");

                entity.HasOne(d => d.User)
                .WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserOid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Comments_User");

                entity.HasOne(d => d.Product)
                .WithMany(p => p.Comments)
                .HasForeignKey(d => d.ProductOid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Comments_Product");
            });

            modelBuilder.Entity<ProductOption>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Option)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

                entity.HasOne(d => d.Product)
                .WithMany(p => p.ProductOptions)
                .HasForeignKey(d => d.ProductOid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductOptions_Product");
            });

            modelBuilder.Entity<FavoriteList>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ListName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.State).HasDefaultValueSql("((1))");

                entity.Property(e => e.UserOid).HasColumnName("UserOId");

                entity.HasOne(d => d.User)
               .WithMany(p => p.FavoriteLists)
               .HasForeignKey(d => d.UserOid)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_FavoriteLists_User");

            });

            modelBuilder.Entity<FavoriteListItem>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Oid).HasColumnName("OId");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ProductOid).HasColumnName("ProductOId");

           

                entity.Property(e => e.FavoriteListOid).HasColumnName("FavoriteListOId");


                entity.HasOne(d => d.FavoriteLists)
                .WithMany(p => p.FavoriteListItems)
                .HasForeignKey(d => d.FavoriteListOid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FavoriteList_FavoriteListItems");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
