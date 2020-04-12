using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
            return View();
        }
        public ActionResult AddWishlist(Guid id)
        {
            var result = ApiUtil.AddWishList(id);
            return View();
        }
    }
}