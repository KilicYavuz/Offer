using System;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class ProductOptions : Entity
    {
        public Guid ProductOid { get; set; }
        public string Option { get; set; }

        public virtual Product Product { get; set; }
    }
}
