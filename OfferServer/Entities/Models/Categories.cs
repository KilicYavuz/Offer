using Entities.Enums;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Categories
    {
        public Categories()
        {
            SubCategories = new HashSet<Categories>();
            Products = new HashSet<Products>();
        }

        public int Oid { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Type { get; set; }
        public int? ParentOid { get; set; }
        public byte[] Image { get; set; }
        public ItemState State { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public virtual Categories ParentCategory { get; set; }
        public virtual ICollection<Categories> SubCategories { get; set; }
        public virtual ICollection<Products> Products { get; set; }
    }
}
