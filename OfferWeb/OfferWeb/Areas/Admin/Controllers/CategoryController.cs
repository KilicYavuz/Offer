using OfferWeb.API;
using Entities.Models;
using System.Web.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class CategoryController : Controller
    {
        // GET: Admin/Category
        public ActionResult AddCategory(int? id)
        {
            if (id == null)
            {
                return View(new Categories());
            }
            else
            {
                return RedirectToAction("ListCategory");
            }
        }

        public ActionResult SaveCategory(Categories category)
        {
            var res = ApiUtil.CreateCategory(category).Result;
            return RedirectToAction("ListCategory");
        }

        public ActionResult ListCategory()
        {
            var categoryList = ApiUtil.GetCategoryList();
            return View();
        }
    }
}