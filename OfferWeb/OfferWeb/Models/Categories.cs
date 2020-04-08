using OfferWeb.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfferWeb.Models
{
    public class Categories
    {
        public int Oid { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Type { get; set; }
        public int? ParentOid { get; set; }
        public byte[] Image { get; set; }
        public ItemState State { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}