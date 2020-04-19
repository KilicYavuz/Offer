using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;

namespace OfferWeb.Controllers
{
    public class BaseController : Controller
    {
        private List<Categories> categories;

        protected List<Categories> Categories { get => categories ?? GetCategories(); set => categories = value; }

        private List<Categories> GetCategories()
        {
            Categories = ApiUtil.GetCategoryList().Result;
            return categories;
        }

        public BaseController()
        {
            //TODO:Heryerde gözükecek olan dataları buradan bir defa yükleyelim. Null kontrolü yapmayı unutmayalım.

            //List<string> cat = new List<string>();
            //string[] sa = { "Kategori1", "Kategori2", "Kategori3", "Kategori4", "Kategori5", "Kategori6", "Kategori7", "Kategori8" };

            //foreach (var a in sa)
            //    cat.Add(a);

            //ViewData["kategoriler"] = cat;

            ApiUtil.InitData();
            GetCategories();
            var objects = ViewBag.Data as Dictionary<string, dynamic> ?? new Dictionary<string, dynamic>();
            objects.Add("SearchCategories", Categories);
            ViewBag.Data = objects;
        }
    }
}