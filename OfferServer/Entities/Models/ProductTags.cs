using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class ProductTag : Entity
    {
        public Guid TagOid { get; set; }
        public Guid ProductOid { get; set; }

        public virtual Product Product { get; set; }
        public virtual Tag Tag { get; set; }
    }
}
