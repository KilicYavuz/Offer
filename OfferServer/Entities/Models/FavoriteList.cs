using Entities.Enums;
using Entities.Migrations;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public class FavoriteList : Entity
    {
        public FavoriteList()
        {
            FavoriteListItems = new HashSet<FavoriteListItem>();
        }
        public Guid UserOid { get; set; }
        public string ListName { get; set; }
        public ItemState State { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<FavoriteListItem> FavoriteListItems { get; set; }

    }
}
