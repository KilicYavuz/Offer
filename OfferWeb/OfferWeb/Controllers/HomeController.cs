using OfferWeb.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfferWeb.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            var objects = new Dictionary<string, dynamic>();
            var bestSellerProducts = ApiUtil.GetBestSellerProducts().Result;
            var categories = ApiUtil.GetCategoryList().Result;
            var opportunityProducts = ApiUtil.GetOpportunityProducts().Result;
            var newProducts = ApiUtil.GetNewProducts().Result;
            var outletProducts = ApiUtil.GetOutletProducts().Result;
            var brands = ApiUtil.GetBrandList().Result;
            objects.Add("Categories", categories);
            objects.Add("BestSellerProducts", bestSellerProducts);
            objects.Add("OpportunityProducts", opportunityProducts);
            objects.Add("NewProducts", newProducts);
            objects.Add("OutletProducts", outletProducts);
            objects.Add("BrandList", brands);
            ViewBag.Data = objects;
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