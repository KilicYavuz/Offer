﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class Address : Entity
    {
        public Guid UserOid { get; set; }
        public string AddressName { get; set; }
        public string NameSurname { get; set; }
        public string AddressInfo { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }

        public virtual User User { get; set; }
    }
}
