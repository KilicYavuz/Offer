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
            Comments = new HashSet<Comment>();
            FavoriteLists = new HashSet<FavoriteList>();
        }

        public string Name { get; set; }
        public string Surname { get; set; }

        /// <summary>
        /// Mağaza Adı
        /// </summary>
        public string CompanyName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime? BirthDate { get; set; }
        public ItemState State { get; set; }
        public UserType UserType { get; set; }
        public string PhoneNumber { get; set; }
        public virtual ICollection<Address> Address { get; set; }


        /// <summary>
        /// User'a Ait Ürünler Listesi
        /// </summary>
        public virtual ICollection<SupplierProduct> SupplierProducts { get; set; }

        /// <summary>
        /// User'ın satın aldığı ürünler
        /// </summary>
        public virtual ICollection<Order> Orders { get; set; }

        /// <summary>
        /// User'ın Satın Aldığı Tüm Ürünler
        /// </summary>
        public virtual ICollection<OrderProduct> OrderProducts { get; set; }

        /// <summary>
        /// User'a ait Ürün Talepleri
        /// </summary>
        public virtual ICollection<Request> Requests { get; set; }

        /// <summary>
        /// User'ın başkalarının açtığı ürün taleplerine verdiği teklifler.
        /// </summary>
        public virtual ICollection<RequestOffer> RequestOffers { get; set; }

        /// <summary>
        /// User'a ait yorumlar
        /// </summary>
        public virtual ICollection<Comment> Comments { get; set; }

        public virtual ICollection<FavoriteList> FavoriteLists { get; set; }


    }
}
