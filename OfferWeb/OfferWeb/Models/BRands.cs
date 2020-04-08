using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfferWeb.Models
{
    public class Brands
    {
        public int Oid { get; set; }
        public string Name { get; set; }
        public byte[] Image { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int Status { get; set; }
    }
}