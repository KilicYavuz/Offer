using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Requests : Entity
    {
        public Requests()
        {
            RequestOffers = new HashSet<RequestOffers>();
            RequestProducts = new HashSet<RequestProducts>();
        }

        public Guid CustomerOid { get; set; }
        public bool CanPartial { get; set; }        
        public int Status { get; set; }
        public Guid? SupplierOid { get; set; }

        public virtual Users Customer { get; set; }
        public virtual ICollection<RequestOffers> RequestOffers { get; set; }
        public virtual ICollection<RequestProducts> RequestProducts { get; set; }
    }
}
