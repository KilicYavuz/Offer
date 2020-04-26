using System;
using System.Collections.Generic;
using Entities.Enums;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class RequestOffer : Entity
    {
        public RequestOffer()
        {
            RequestOfferProducts = new HashSet<RequestOfferProduct>();
        }

        public Guid SupplierOid { get; set; }
        public int SupplierDisplayId { get; set; }
        public bool IsPartialOffer { get; set; }
        public ItemState State { get; set; }
        public Guid RequestOid { get; set; }

        public virtual Request Request { get; set; }
        public virtual User Supplier { get; set; }
        public virtual ICollection<RequestOfferProduct> RequestOfferProducts { get; set; }
    }
}
