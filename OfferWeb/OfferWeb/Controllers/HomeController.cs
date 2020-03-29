using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfferWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            List<string> cat = new List<string>();
            string[] sa = { "Kategori1", "Kategori2", "Kategori3", "Kategori4", "Kategori5", "Kategori6", "Kategori7", "Kategori8" };
            
            foreach (var a in sa)
                cat.Add(a);
            
            ViewData["kategoriler"] = cat;
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}