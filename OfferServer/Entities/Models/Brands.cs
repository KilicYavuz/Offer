﻿using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Brands
    {
        public Brands()
        {
            Products = new HashSet<Products>();
        }

        public int Oid { get; set; }
        public string Name { get; set; }
        public byte[] Image { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int Status { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}