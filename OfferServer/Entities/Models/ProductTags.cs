using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class ProductTags : Entity
    {
        public Guid TagOid { get; set; }
        public Guid ProductOid { get; set; }

        public virtual Products Product { get; set; }
        public virtual Tags Tags { get; set; }
    }
}
