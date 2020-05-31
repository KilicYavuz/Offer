using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.Enums;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Tag : Entity
    {
        public Tag()
        {
            ProductTags = new HashSet<ProductTag>();
        }

        public string Name { get; set; }
        public ItemState State { get; set; }

        public virtual ICollection<ProductTag> ProductTags { get; set; }
    }
}
