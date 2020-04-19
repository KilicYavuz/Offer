using Entities.Enums;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Brands : Entity
    {
        public Brands()
        {
            Products = new HashSet<Products>();
        }

        public string Name { get; set; }
        public string Image { get; set; }
        public ItemState State { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
