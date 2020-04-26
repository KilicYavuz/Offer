using Entities.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Product : Entity
    {
        public Product()
        {
            OrderProducts = new HashSet<OrderProduct>();
            ProductTags = new HashSet<ProductTag>();
            RequestProducts = new HashSet<RequestProduct>();
            SupplierProducts = new HashSet<SupplierProduct>();
            ProductOptions = new HashSet<ProductOptions>();
        }

        public string Name { get; set; }
        public Guid BrandOid { get; set; }
        public ItemState State { get; set; }
        public Guid CategoryOid { get; set; }
        public double Price { get; set; }
        public int Stock { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public bool Verified { get; set; }
        public string VerificationCode { get; set; }
        public string Image { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }

        public virtual Brand Brand { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<OrderProduct> OrderProducts { get; set; }
        public virtual ICollection<ProductTag> ProductTags { get; set; }
        public virtual ICollection<ProductOptions> ProductOptions { get; set; }
        public virtual ICollection<RequestProduct> RequestProducts { get; set; }
        public virtual ICollection<SupplierProduct> SupplierProducts { get; set; }
        
        [NotMapped]
        [BindProperty]
        public virtual ICollection<Guid> SelectedTags { get; set; }

        [NotMapped]
        [BindProperty]
        public virtual ICollection<Tag> TagList { get; set; }
    }
}
