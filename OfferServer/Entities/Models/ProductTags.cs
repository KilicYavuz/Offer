using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class ProductTags
    {
        public int Oid { get; set; }
        public int TagOid { get; set; }
        public Guid ProductOid { get; set; }

        public virtual Products Product { get; set; }
        public virtual Tags Tags { get; set; }
    }
}
