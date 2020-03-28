using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    [Table("Tags")]
    public partial class Tags
    {
        public Tags()
        {
            ProductTags = new HashSet<ProductTags>();
        }

        public int Oid { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Status { get; set; }

        public virtual ICollection<ProductTags> ProductTags { get; set; }
    }
}
