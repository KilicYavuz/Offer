using Entities.Models;
using OfferWeb.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using OfferWeb.Helpers;

namespace OfferWeb.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ProductController :Controller
    {
        // GET: Admin/Product
        public ActionResult AddProduct(Guid? id)
        {
            try
            {
                var objects = new Dictionary<string, dynamic>();
                var brands = ApiUtil.GetBrandList().Result ?? new List<Brand>();
                var categories = ApiUtil.GetCategoryListForArea().Result ?? new List<Category>();
                var tagList = ApiUtil.GetTagList().Result ?? new List<Tag>();

                objects.Add("Brands", brands);
                objects.Add("Categories", categories);
                objects.Add("TagList", tagList);
                ViewBag.Data = objects;

                // TODO: ViewData nasıl?
                if (id == null)
                {
                    return View(new Product() { TagList = tagList});
                }
                else
                {
                    var product = ApiUtil.GetProduct(id.Value).Result;
                    product.TagList = tagList;
                    return View(product);
                }
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message}));
            }
        }

        public ActionResult SaveProduct(Product model)
        {
            try
            {
                if (model.ImageFile != null)
                {
                    model.Image = Util.GetBase64FromImage(model.ImageFile);
                }
                model.ImageFile = null;

                if (model.Oid == Guid.Empty)
                {
                    model.State = Entities.Enums.ItemState.Active;
                    var res = ApiUtil.AddProduct(model).Result;
                }
                else
                {
                    var res = ApiUtil.UpdateProduct(model).Result;
                }
                return RedirectToAction("ListProduct");
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }
        }

        public ActionResult ListProduct()
        {
            try
            {
                var productList = ApiUtil.GetProductList().Result;
                return View(productList);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
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
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }

        }

    }
}