using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class RequestProducts : Entity
    {
        public RequestProducts()
        {
            RequestOfferProducts = new HashSet<RequestOfferProducts>();
        }

        public int Quantity { get; set; }
        public bool IsPartial { get; set; }
        public Guid ProductOid { get; set; }
        public Guid RequestOid { get; set; }

        public virtual Products Product { get; set; }
        public virtual Requests Request { get; set; }
        public virtual ICollection<RequestOfferProducts> RequestOfferProducts { get; set; }
    }
}
