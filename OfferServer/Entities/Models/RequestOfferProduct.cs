using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class RequestOfferProduct : Entity
    {
        public Guid RequestProductOid { get; set; }
        public Guid RequestOfferOid { get; set; }
        public double? OfferedPrice { get; set; }
        public int? OfferedQuantity { get; set; }

        public virtual RequestOffer RequestOffer { get; set; }
        public virtual RequestProduct RequestProduct { get; set; }
    }
}
