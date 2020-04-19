using Entities.Enums;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Categories : Entity
    {
        public Categories()
        {
            SubCategories = new HashSet<Categories>();
            Products = new HashSet<Products>();
        }

        public string Name { get; set; }
        public int Type { get; set; }
        public Guid? ParentOid { get; set; }
        public string Image { get; set; }
        public ItemState State { get; set; }

        public virtual Categories ParentCategory { get; set; }
        public virtual ICollection<Categories> SubCategories { get; set; }
        public virtual ICollection<Products> Products { get; set; }
    }
}
