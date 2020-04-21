using Entities.Enums;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Categories : Entity
    {
        public Categories()
        {
            SubCategories = new HashSet<Categories>();
            Products = new HashSet<Products>();
        }

        public string Name { get; set; }
        public int Type { get; set; }
        public Guid? ParentOid { get; set; }
        public ItemState State { get; set; }
        public string Image { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        
        //[JsonIgnore]
        //[IgnoreDataMember]
        public virtual Categories ParentCategory { get; set; }
        //[JsonIgnore]
        //[IgnoreDataMember]
        public virtual ICollection<Categories> SubCategories { get; set; }
        //[JsonIgnore]
        //[IgnoreDataMember]
        public virtual ICollection<Products> Products { get; set; }
    }
}
