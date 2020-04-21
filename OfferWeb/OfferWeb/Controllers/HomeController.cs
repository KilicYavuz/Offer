using OfferWeb.API;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Entities.Models;

namespace OfferWeb.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            var objects = base.ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();

            objects.Add("SearchCategories", Categories ?? new List<Categories>());
            var mainScreenProducts = ApiUtil.GetMainScreenProducts().Result;
            var bestSellerProducts = ApiUtil.GetBestSellerProducts().Result;
            var opportunityProducts = ApiUtil.GetOpportunityProducts().Result;
            var newProducts = ApiUtil.GetNewProducts().Result;
            var outletProducts = ApiUtil.GetOutletProducts().Result;
            var brands = ApiUtil.GetBrandList().Result;
            var categories = ApiUtil.GetCategoryList().Result;
            objects.Add("BestSellerProducts", bestSellerProducts);
            objects.Add("MainScreenProducts", mainScreenProducts);
            objects.Add("OpportunityProducts", opportunityProducts);
            objects.Add("NewProducts", newProducts);
            objects.Add("OutletProducts", outletProducts);
            objects.Add("Categories", categories);
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