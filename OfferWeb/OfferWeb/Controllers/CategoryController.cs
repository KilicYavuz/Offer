using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;

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
            var productList = ApiUtil.GetProductByCategory(id);
            return View(productList);
        }
    }
}