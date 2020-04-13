using Entities.Models;
using OfferWeb.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class TagController : Controller
    {
        // GET: Admin/Tag
        public ActionResult AddTag(int? id)
        {
            if (id == null)
            {
                return View(new Tags());
            }
            else
            {
                var tag = ApiUtil.GetTag(id.Value);
                return View(tag.Result);
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