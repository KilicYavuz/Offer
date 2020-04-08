using OfferWeb.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfferWeb.Models
{
    public class Products
    {
        public string Name { get; set; }
        public int BrandOid { get; set; }
        public DateTime CreatedDate { get; set; }
        public ItemState State { get; set; }
        public int CategoryOid { get; set; }
        public double Price { get; set; }
        public int Stock { get; set; }
        public bool Verified { get; set; }
        public string VerificationCode { get; set; }
        public Guid Oid { get; set; }
        public byte[] Image { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}