using OfferWeb.API;
using Entities.Models;
using System.Web.Mvc;
using System.Collections.Generic;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class CategoryController : Controller
    {
        // GET: Admin/Category
        public ActionResult AddCategory(int? id)
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

        public ActionResult SaveCategory(Categories category)
        {

            if (category.Oid == 0)
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

        public ActionResult ListCategory()
        {
            var categoryList = ApiUtil.GetCategoryList().Result;
            return View(categoryList);
        }

        public ActionResult DeleteCategory(int id)
        {
            var res = ApiUtil.DeleteCategory(id);
            return RedirectToAction("ListCategory");
        }
    }
}