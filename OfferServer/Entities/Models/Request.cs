using System;
using System.Collections.Generic;
using Entities.Enums;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Request : Entity
    {
        public Request()
        {
            RequestOffers = new HashSet<RequestOffer>();
            RequestProducts = new HashSet<RequestProduct>();
        }

        public Guid CustomerOid { get; set; }
        public bool CanPartial { get; set; }        
        public ItemState State { get; set; }
        public Guid? SupplierOid { get; set; }

        public virtual User Customer { get; set; }
        public virtual ICollection<RequestOffer> RequestOffers { get; set; }
        public virtual ICollection<RequestProduct> RequestProducts { get; set; }
    }
}
