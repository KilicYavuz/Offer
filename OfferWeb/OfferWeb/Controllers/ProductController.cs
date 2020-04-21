using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;

namespace OfferWeb.Controllers
{
    public class ProductController : BaseController
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ProductDetail(Guid Oid)
        {
            var objects = base.ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();
            var product = ApiUtil.GetProduct(Oid).Result;
            var categories = ApiUtil.GetCategoryList().Result;
            objects.Add("SearchCategories", categories ?? new List<Categories>());
            ViewBag.Data = objects;
            return View(product);
        }
    }
}