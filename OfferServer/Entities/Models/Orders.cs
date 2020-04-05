using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Orders
    {
        public Orders()
        {
            OrderProducts = new HashSet<OrderProducts>();
        }

        public int CustomerOid { get; set; }
        public DateTime CreatedDate { get; set; }
        public int State { get; set; }
        public bool PaymentState { get; set; }
        public int PaymentType { get; set; }
        public double TotalPrice { get; set; }
        public int ShippingAddressOid { get; set; }
        public int? BillingAddresOid { get; set; }
        public Guid Oid { get; set; }

        public virtual Users Customer { get; set; }
        public virtual ICollection<OrderProducts> OrderProducts { get; set; }
    }
}
