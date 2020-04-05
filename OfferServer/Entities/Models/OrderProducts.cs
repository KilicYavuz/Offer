using System;

namespace Entities.Models
{
    public partial class OrderProducts
    {
        public Guid Oid { get; set; }
        public Guid OrderOid { get; set; }
        public int SupplierOid { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public Guid ProductOid { get; set; }
        public int ItemType { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Orders Order { get; set; }
        public virtual Products Product { get; set; }
        public virtual Users Supplier { get; set; }
    }
}
