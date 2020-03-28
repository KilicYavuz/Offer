using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class RequestOffers
    {
        public RequestOffers()
        {
            RequestOfferProducts = new HashSet<RequestOfferProducts>();
        }

        public int SupplierOid { get; set; }
        public int SupplierDisplayId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsPartialOffer { get; set; }
        public Guid Oid { get; set; }
        public int Status { get; set; }
        public Guid RequestOid { get; set; }

        public virtual Requests RequestO { get; set; }
        public virtual Users SupplierO { get; set; }
        public virtual ICollection<RequestOfferProducts> RequestOfferProducts { get; set; }
    }
}
