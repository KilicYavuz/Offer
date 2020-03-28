using System;
using System.Collections.Generic;

namespace Entities.Models
{
    public partial class Users
    {
        public Users()
        {
            Address = new HashSet<Address>();
            OrderProducts = new HashSet<OrderProducts>();
            Orders = new HashSet<Orders>();
            RequestOffers = new HashSet<RequestOffers>();
            Requests = new HashSet<Requests>();
            SupplierProducts = new HashSet<SupplierProducts>();
        }

        public int Oid { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string CompanyName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime? BirthDate { get; set; }
        public int State { get; set; }
        public int UserType { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedDate { get; set; }

        public virtual ICollection<Address> Address { get; set; }
        public virtual ICollection<OrderProducts> OrderProducts { get; set; }
        public virtual ICollection<Orders> Orders { get; set; }
        public virtual ICollection<RequestOffers> RequestOffers { get; set; }
        public virtual ICollection<Requests> Requests { get; set; }
        public virtual ICollection<SupplierProducts> SupplierProducts { get; set; }
    }
}
