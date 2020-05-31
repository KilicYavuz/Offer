using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class RequestProduct : Entity
    {
        public RequestProduct()
        {
            RequestOfferProducts = new HashSet<RequestOfferProduct>();
        }

        public int Quantity { get; set; }
        public bool IsPartial { get; set; }
        public Guid ProductOid { get; set; }
        public Guid RequestOid { get; set; }

        public virtual Product Product { get; set; }
        public virtual Request Request { get; set; }
        public virtual ICollection<RequestOfferProduct> RequestOfferProducts { get; set; }
    }
}
