using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class SupplierProducts : Entity
    {
        public Guid SupplierOid { get; set; }
        public int State { get; set; }
        public double? Price { get; set; }
        public Guid ProductOid { get; set; }
        public string Description { get; set; }

        public virtual Products Product { get; set; }
        public virtual Users Supplier { get; set; }
    }
}
