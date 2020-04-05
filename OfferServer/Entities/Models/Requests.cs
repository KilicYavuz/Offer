using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Requests
    {
        public Requests()
        {
            RequestOffers = new HashSet<RequestOffers>();
            RequestProducts = new HashSet<RequestProducts>();
        }

        public int CustomerOid { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool CanPartial { get; set; }
        public Guid Oid { get; set; }
        public int Status { get; set; }
        public int? SupplierOid { get; set; }

        public virtual Users Customer { get; set; }
        public virtual ICollection<RequestOffers> RequestOffers { get; set; }
        public virtual ICollection<RequestProducts> RequestProducts { get; set; }
    }
}
