using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class RequestOfferProducts : Entity
    {
        public Guid RequestProductOid { get; set; }
        public Guid RequestOfferOid { get; set; }
        public double? OfferedPrice { get; set; }
        public int? OfferedQuantity { get; set; }

        public virtual RequestOffers RequestOfferO { get; set; }
        public virtual RequestProducts RequestProductO { get; set; }
    }
}
