using Entities.Enums;
using System.Web;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Brand : Entity
    {
        public Brand()
        {
            Products = new HashSet<Product>();
        }

        public string Name { get; set; }
        public string Image { get; set; }
        public ItemState State { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
