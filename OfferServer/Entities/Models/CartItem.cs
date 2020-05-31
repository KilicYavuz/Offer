using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class CartItem : Entity
    {
        public Guid CustomerOid { get; set; }
        public Guid SupplierOid { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public Guid ProductOid { get; set; }

        /// <summary>
        /// Ürün Direk Satış ürünü mü yada teklife açık bir ürün müydü.
        /// </summary>
        public int ItemType { get; set; }
    }
}

