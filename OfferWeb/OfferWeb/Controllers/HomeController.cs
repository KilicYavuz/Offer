using OfferWeb.API;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Entities.Models;
using OfferWeb.Helpers;

namespace OfferWeb.Controllers
{
    [ServiceFilter(typeof(LoginFilter))]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            var objects = base.ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();

            objects.Add("SearchCategories", Categories ?? new List<Category>());
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

        [IgnoreAttribute]
        public IActionResult Login(string mail, string password)
        {
            return View();
        }

        [IgnoreAttribute]
        public ActionResult LogIn(string mail, string password)
        {
            var token = GetTokenByPassword(mail, password);
            if (token != null)
            {
                HttpContext.Session.Set("token", System.Text.Encoding.UTF8.GetBytes(token));
                ViewBag.Token = token;
                return Content(token);
            }
            else
            {
                return Content("Error");
            }

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


    }
}