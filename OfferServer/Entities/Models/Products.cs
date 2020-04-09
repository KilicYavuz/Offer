using Entities.Enums;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Products
    {
        public Products()
        {
            OrderProducts = new HashSet<OrderProducts>();
            ProductTags = new HashSet<ProductTags>();
            RequestProducts = new HashSet<RequestProducts>();
            SupplierProducts = new HashSet<SupplierProducts>();
        }

        public string Name { get; set; }
        public int BrandOid { get; set; }
        public DateTime CreatedDate { get; set; }
        public ItemState State { get; set; }
        public int CategoryOid { get; set; }
        public double Price { get; set; }
        public int Stock { get; set; }
        public bool Verified { get; set; }
        public string VerificationCode { get; set; }
        public Guid Oid { get; set; }
        public string Image { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public virtual Brands Brand { get; set; }
        public virtual Categories Category { get; set; }
        public virtual ICollection<OrderProducts> OrderProducts { get; set; }
        public virtual ICollection<ProductTags> ProductTags { get; set; }
        public virtual ICollection<RequestProducts> RequestProducts { get; set; }
        public virtual ICollection<SupplierProducts> SupplierProducts { get; set; }
    }
}
