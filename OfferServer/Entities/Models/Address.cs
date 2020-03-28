using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Address
    {
        public int Oid { get; set; }
        public int UserOid { get; set; }
        public string AddressName { get; set; }
        public string NameSurname { get; set; }
        public string AddressInfo { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual Users UserO { get; set; }
    }
}
