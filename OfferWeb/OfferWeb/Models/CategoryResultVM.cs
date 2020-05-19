using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OfferWeb.Models
{
    public class CategoryResultVM
    {
        public List<Product> ProductList{ get; set; }
        public Category Category { get; set; }
    }
}
