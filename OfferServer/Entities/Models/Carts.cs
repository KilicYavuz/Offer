using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Carts
    {
        public Guid Oid { get; set; }
        public int CustomerOid { get; set; }
        public int SupplierOid { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public Guid ProductOid { get; set; }
        public int ItemType { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
