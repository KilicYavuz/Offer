using Entities.Enums;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Orders : Entity
    {
        public Orders()
        {
            OrderProducts = new HashSet<OrderProducts>();
        }

        public Guid CustomerOid { get; set; }
        public ItemState State { get; set; }
        public bool PaymentState { get; set; }
        public int PaymentType { get; set; }
        public double TotalPrice { get; set; }
        public Guid ShippingAddressOid { get; set; }
        public Guid? BillingAddresOid { get; set; }

        public virtual Users Customer { get; set; }
        public virtual ICollection<OrderProducts> OrderProducts { get; set; }
    }
}
