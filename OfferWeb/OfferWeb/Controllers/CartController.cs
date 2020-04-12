using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;

namespace OfferWeb.Controllers
{
    public class CartController : BaseController
    {
        // GET: Cart
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AddCart(Guid id)
        {
            var result = ApiUtil.AddCart(id);
            return View();
        }
    }
}