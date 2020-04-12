using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using OfferWeb.API;

namespace OfferWeb.Controllers
{
    public class BaseController : Controller
    {
        public BaseController()
        {
            //TODO:Heryerde gözükecek olan dataları buradan bir defa yükleyelim. Null kontrolü yapmayı unutmayalım.

            //List<string> cat = new List<string>();
            //string[] sa = { "Kategori1", "Kategori2", "Kategori3", "Kategori4", "Kategori5", "Kategori6", "Kategori7", "Kategori8" };

            //foreach (var a in sa)
            //    cat.Add(a);

            //ViewData["kategoriler"] = cat;


            var objects = new Dictionary<string, dynamic>();
            var categories = ApiUtil.GetCategoryList().Result;
            objects.Add("SearchCategories", categories);
            ViewBag.Data = objects;
        }
    }
}