using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class RequestOffers : Entity
    {
        public RequestOffers()
        {
            RequestOfferProducts = new HashSet<RequestOfferProducts>();
        }

        public Guid SupplierOid { get; set; }
        public int SupplierDisplayId { get; set; }
        public bool IsPartialOffer { get; set; }
        public int Status { get; set; }
        public Guid RequestOid { get; set; }

        public virtual Requests Request { get; set; }
        public virtual Users Supplier { get; set; }
        public virtual ICollection<RequestOfferProducts> RequestOfferProducts { get; set; }
    }
}
