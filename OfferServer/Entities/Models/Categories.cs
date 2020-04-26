using Entities.Enums;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Category : Entity
    {
        public Category()
        {
            SubCategories = new HashSet<Category>();
            Products = new HashSet<Product>();
        }

        public string Name { get; set; }
        public int Type { get; set; }
        public Guid? ParentOid { get; set; }
        public ItemState State { get; set; }
        public string Image { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        
        public virtual Category ParentCategory { get; set; }
        public virtual ICollection<Category> SubCategories { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
