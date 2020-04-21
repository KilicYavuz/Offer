using Entities.Enums;
using Newtonsoft.Json;
using System;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Notifications : Entity
    {
        public Guid UserOid { get; set; }
        public string Message { get; set; }
        public ItemState State { get; set; }
    }
}
