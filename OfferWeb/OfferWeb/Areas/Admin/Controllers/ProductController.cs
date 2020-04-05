using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class ProductController : Controller
    {
        // GET: Admin/Product
        public ActionResult AddProduct()
        {
            return View();
        }

        public ActionResult ListProduct()
        {
            return View();
        }
    }
}