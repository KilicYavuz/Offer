using OfferWeb.API;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;
using System;
using OfferWeb.Helpers;

namespace OfferWeb.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CategoryController : Controller
    {
        // GET: Admin/Category
        public ActionResult AddCategory(Guid? id)
        {
            try
            {
                var objects = new Dictionary<string, dynamic>();
                var categories = ApiUtil.GetCategoryList().Result;
                objects.Add("Categories", categories);
                ViewBag.Data = objects;

                if (id == null)
                {
                    return View(new Category());
                }
                else
                {
                    var category = ApiUtil.GetCategory(id.Value);
                    return View(category.Result);
                }
            }
            catch (System.Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }

        }

        public ActionResult SaveCategory(Category model)
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
                    var res = ApiUtil.AddCategory(model).Result;
                }
                else
                {
                    var res = ApiUtil.UpdateCategory(model).Result;
                }

                return RedirectToAction("ListCategory");
            }
            catch (System.Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }

        public ActionResult ListCategory()
        {
            try
            {
                var categoryList = ApiUtil.GetCategoryList().Result;
                return View(categoryList);
            }
            catch (System.Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }

        public ActionResult DeleteCategory(Guid id)
        {
            try
            {
                var res = ApiUtil.DeleteCategory(id);
                return RedirectToAction("ListCategory");
            }
            catch (System.Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }
    }
}