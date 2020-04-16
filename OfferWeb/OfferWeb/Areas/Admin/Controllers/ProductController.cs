using Entities.Models;
using OfferWeb.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace OfferWeb.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ProductController :Controller
    {
        // GET: Admin/Product
        public ActionResult AddProduct(int? id)
        {
            try
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
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }

        public ActionResult SaveProduct(Products product)
        {
            try
            {
                if (product.Oid == Guid.Empty)
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
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }

        public ActionResult ListProduct()
        {
            try
            {
                var productList = ApiUtil.GetProductList().Result;
                if (productList=="[]")
                {
                    throw new Exception("Listelenecek ürün bulunamadı");
                }
                return View(productList);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }

        }

        public ActionResult DeleteProduct(Guid id)
        {
            try
            {
                var res = ApiUtil.DeleteProduct(id);
                return RedirectToAction("ListProduct");
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }

        }
    }
}