using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class SalesLists
    {
        public int Oid { get; set; }
        public int SupplierOid { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool State { get; set; }
        public double? Price { get; set; }
        public Guid ProductOid { get; set; }
        public string Description { get; set; }

        public virtual Products ProductO { get; set; }
        public virtual Users SupplierO { get; set; }
    }
}
