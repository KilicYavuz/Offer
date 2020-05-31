using System;
using Entities.Enums;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class SupplierProduct : Entity
    {
        public Guid SupplierOid { get; set; }
        public ItemState State { get; set; }
        public double? Price { get; set; }
        public Guid ProductOid { get; set; }
        public string Description { get; set; }

        public virtual Product Product { get; set; }
        public virtual User Supplier { get; set; }
    }
}
