using Entities.Models;
using OfferWeb.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class BrandController : Controller
    {
        // GET: Admin/Brand
        public ActionResult AddBrand(int? id)
        {
            if (id == null)
            {
                return View(new Brands());
            }
            else
            {
                var brand = ApiUtil.GetBrand(id.Value);
                return View(brand.Result);
            }
        }

        public ActionResult SaveBrand(Brands brand)
        {
            if (brand.Oid == 0)
            {
                brand.State = Entities.Enums.ItemState.Active;
                var res = ApiUtil.AddBrand(brand).Result;
            }
            else
            {
                var res = ApiUtil.UpdateBrand(brand).Result;
            }
            return RedirectToAction("ListBrand");
        }

        public ActionResult ListBrand()
        {
            var brandList = ApiUtil.GetBrandList().Result;
            return View(brandList);
        }

        public ActionResult DeleteBrand(int id)
        {
            var res = ApiUtil.DeleteBrand(id);
            return RedirectToAction("ListBrand");
        }
    }
}