using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Carts : Entity
    {
        public Guid CustomerOid { get; set; }
        public Guid SupplierOid { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public Guid ProductOid { get; set; }
        public int ItemType { get; set; }
    }
}
