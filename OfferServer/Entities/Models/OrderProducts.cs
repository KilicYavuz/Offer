using Entities.Enums;
using Newtonsoft.Json;
using System;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class OrderProduct : Entity
    {
        public Guid OrderOid { get; set; }
        public Guid SupplierOid { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public Guid ProductOid { get; set; }
        public ItemState ItemType { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
        public virtual User Supplier { get; set; }
    }
}
