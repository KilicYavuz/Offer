using Entities.Enums;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Order : Entity
    {
        public Order()
        {
            OrderProducts = new HashSet<OrderProduct>();
        }

        public Guid CustomerOid { get; set; }
        public ItemState State { get; set; }
        public bool PaymentState { get; set; }
        public int PaymentType { get; set; }
        public double TotalPrice { get; set; }
        public Guid ShippingAddressOid { get; set; }
        public Guid? BillingAddresOid { get; set; }

        public virtual User Customer { get; set; }
        public virtual ICollection<OrderProduct> OrderProducts { get; set; }
    }
}
