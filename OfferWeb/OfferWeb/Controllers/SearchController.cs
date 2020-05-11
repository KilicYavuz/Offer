using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfferWeb.API;

namespace OfferWeb.Controllers
{
    public class SearchController : BaseController
    {
        public IActionResult Index(string searchProduct)
        {
            var objects = base.ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();
            var categories = ApiUtil.GetCategoryList().Result;
            //var product = ApiUtil.Search(searchProduct).Result;
            objects.Add("SearchCategories", categories ?? new List<Category>());
            //objects.Add("Products", product ?? new List<Product>());
            ViewBag.Data = objects;
            return View();
        }

        public async Task<string> SearchProduct(string term, Guid? CategoryId = null)
        {
            var result = await ApiUtil.Search(term, CategoryId);
            return JsonConvert.SerializeObject(result);
        }
    }
}