using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Tags : Entity
    {
        public Tags()
        {
            ProductTags = new HashSet<ProductTags>();
        }

        public string Name { get; set; }
        public int State { get; set; }

        public virtual ICollection<ProductTags> ProductTags { get; set; }
    }
}
