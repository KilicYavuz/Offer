using OfferWeb.API;
using OfferWeb.Models;
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
        public ActionResult AddProduct(int? id)
        {

            var objects = new Dictionary<string, dynamic>();
            //objects.Add("Branch", branches);  gibi ekle geç
            //Markaları getir
            //Kategorileri getir
            if (id == 0 || id == null)
            {
                return View(new Products());
            }

            else
            {
                return RedirectToAction("ListProduct");
            }
        }

        public ActionResult SaveProduct(Products product)
        {
            var res = ApiUtil.CreateProduct(product).Result;
            return RedirectToAction("ListProduct");
        }

        public ActionResult ListProduct()
        {
            var productList = ApiUtil.GetProductList();
            return View();
        }
    }
}