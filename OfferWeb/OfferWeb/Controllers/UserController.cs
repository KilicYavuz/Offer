using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;

namespace OfferWeb.Controllers
{
    public class UserController : BaseController
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Wishlist()
        {
            var Categories = ApiUtil.GetCategoryList().Result;
            var objects = ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();
            objects.Add("SearchCategories", Categories ?? new List<Category>());
            ViewBag.Data = objects;

            return View();
        }
        public ActionResult AddWishlist(Guid id, Guid userId)
        {
            var result = ApiUtil.AddWishList(id,userId);
            return View();
        }
    }
}