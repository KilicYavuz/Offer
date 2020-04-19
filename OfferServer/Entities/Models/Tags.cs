using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    [Table("Tags")]
    public partial class Tags : Entity
    {
        public Tags()
        {
            ProductTags = new HashSet<ProductTags>();
        }

        public string Name { get; set; }
        public int State { get; set; }

        public virtual ICollection<ProductTags> ProductTags { get; set; }
    }
}
