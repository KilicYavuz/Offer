using Entities.Enums;
using System;

namespace Entities.Models
{
    public partial class OrderProducts : Entity
    {
        public Guid OrderOid { get; set; }
        public Guid SupplierOid { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public Guid ProductOid { get; set; }
        public ItemState ItemType { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Orders Order { get; set; }
        public virtual Products Product { get; set; }
        public virtual Users Supplier { get; set; }
    }
}
