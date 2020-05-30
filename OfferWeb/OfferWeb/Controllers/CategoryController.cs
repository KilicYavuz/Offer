using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;
using OfferWeb.Models;

namespace OfferWeb.Controllers
{
    public class CategoryController : BaseController
    {
        // GET: Category
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CategoryResult(Guid id)
        {
            var objects = base.ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();
            var categories = ApiUtil.GetCategoryList().Result;
            objects.Add("SearchCategories", categories ?? new List<Category>());
            ViewBag.Data = objects;
            var productList = ApiUtil.GetProductByCategory(id).Result;

            if (productList == null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View(new CategoryResultVM() { ProductList = productList, Category = categories.FirstOrDefault(x => x.Oid == id) });
        }
    }
}