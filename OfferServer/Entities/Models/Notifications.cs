using Entities.Enums;
using System;

namespace Entities.Models
{
    public partial class Notifications : Entity
    {
        public Guid UserOid { get; set; }
        public string Message { get; set; }
        public ItemState State { get; set; }
    }
}
