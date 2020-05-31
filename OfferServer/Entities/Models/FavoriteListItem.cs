using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public class FavoriteListItem : Entity
    {
        public Guid FavoriteListOid { get; set; }
        public Guid ProductOid { get; set; }


        public virtual FavoriteList FavoriteLists { get; set; }
        public virtual Product Product { get; set; }
    
    }
}
