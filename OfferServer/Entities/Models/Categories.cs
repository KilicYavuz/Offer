using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Categories
    {
        public Categories()
        {
            InverseParentO = new HashSet<Categories>();
            Products = new HashSet<Products>();
        }

        public int Oid { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Type { get; set; }
        public int? ParentOid { get; set; }

        public virtual Categories ParentO { get; set; }
        public virtual ICollection<Categories> InverseParentO { get; set; }
        public virtual ICollection<Products> Products { get; set; }
    }
}
