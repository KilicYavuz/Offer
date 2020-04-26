using System;
using System.Collections.Generic;
using Entities.Enums;
using Newtonsoft.Json;

namespace Entities.Models
{
    [JsonObject(IsReference = true)]
    public partial class User : Entity
    {
        public User()
        {
            Address = new HashSet<Address>();
            OrderProducts = new HashSet<OrderProduct>();
            Orders = new HashSet<Order>();
            RequestOffers = new HashSet<RequestOffer>();
            Requests = new HashSet<Request>();
            SupplierProducts = new HashSet<SupplierProduct>();
        }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string CompanyName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime? BirthDate { get; set; }
        public ItemState State { get; set; }
        public int UserType { get; set; }
        public string PhoneNumber { get; set; }

        public virtual ICollection<Address> Address { get; set; }
        public virtual ICollection<OrderProduct> OrderProducts { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<RequestOffer> RequestOffers { get; set; }
        public virtual ICollection<Request> Requests { get; set; }
        public virtual ICollection<SupplierProduct> SupplierProducts { get; set; }
    }
}
