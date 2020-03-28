using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class RequestProducts
    {
        public RequestProducts()
        {
            RequestOfferProducts = new HashSet<RequestOfferProducts>();
        }

        public int Quantity { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsPartial { get; set; }
        public Guid ProductOid { get; set; }
        public Guid Oid { get; set; }
        public Guid RequestOid { get; set; }

        public virtual Products ProductO { get; set; }
        public virtual Requests RequestO { get; set; }
        public virtual ICollection<RequestOfferProducts> RequestOfferProducts { get; set; }
    }
}
