using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]

    public class Comment:Entity
    {
        public Guid UserOid { get; set; }
        public Guid ProductOid { get; set; }
        public string CommentContent { get; set; }

        public virtual User User { get; set; }
        public virtual Product Product { get; set; }
    }
}
