using Entities.Models;
using OfferWeb.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class ProductController : Controller
    {
        // GET: Admin/Product
        public ActionResult AddProduct(int? id)
        {
            var objects = new Dictionary<string, dynamic>();
            var brands = ApiUtil.GetBrandList().Result;
            var categories = ApiUtil.GetCategoryList().Result;
            var tagList = ApiUtil.GetTagList().Result;
            
            objects.Add("Brands", brands);
            objects.Add("Categories", categories);
            objects.Add("TagList", categories);
            ViewBag.Data = objects;
            // TODO: ViewData nasıl?
            if (id == null)
            {
                return View(new Products());
            }
            else
            {
                var product = ApiUtil.GetProduct(id.Value);
                return View(product.Result);
            }
        }

        public ActionResult SaveProduct(Products product)
        {
            if(product.Oid != Guid.Empty)
            {
                product.State = Entities.Enums.ItemState.Active;
                var res = ApiUtil.AddProduct(product).Result;
            }
            else
            {
                var res = ApiUtil.UpdateProduct(product).Result;
            }
            return RedirectToAction("ListProduct");
        }

        public ActionResult ListProduct()
        {
            var productList = ApiUtil.GetProductList().Result;
            return View(productList);
        }

        public ActionResult DeleteProduct(Guid id)
        {
            var res = ApiUtil.DeleteProduct(id);
            return RedirectToAction("ListProduct");
        }
    }
}