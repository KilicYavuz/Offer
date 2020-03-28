using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Notifications
    {
        public Guid Oid { get; set; }
        public int UserOid { get; set; }
        public string Message { get; set; }
        public string CreatedDate { get; set; }
        public int State { get; set; }
    }
}
