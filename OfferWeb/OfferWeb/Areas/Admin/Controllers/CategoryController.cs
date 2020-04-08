using OfferWeb.API;
using OfferWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class CategoryController : Controller
    {
        // GET: Admin/Category
        public ActionResult AddCategory()
        {
            return View(new Categories());
        }

        public ActionResult SaveCategory(Categories category)
        {
            var res = ApiUtil.CreateCategory(category).Result;
            return RedirectToAction("ListCategory");
        }

        public ActionResult ListCategory()
        {
            var categoryList = ApiUtil.GetCategoryList();
            return View();
        }
    }
}