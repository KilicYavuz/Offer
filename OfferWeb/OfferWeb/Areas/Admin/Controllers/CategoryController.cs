using OfferWeb.API;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Routing;
using System;

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
                    return View(new Categories());
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

        public ActionResult SaveCategory(Categories category)
        {
            try
            {
                if (category.Oid == Guid.Empty)
                {
                    category.State = Entities.Enums.ItemState.Active;
                    var res = ApiUtil.AddCategory(category).Result;
                }
                else
                {
                    var res = ApiUtil.UpdateCategory(category).Result;
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