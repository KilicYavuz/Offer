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
    public class BrandController : Controller
    {
        // GET: Admin/Brand
        public ActionResult AddBrand(int? id)
        {
            try
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
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }

        }

        public ActionResult SaveBrand(Brands brand)
        {
            try
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
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }

        public ActionResult ListBrand()
        {
            try
            {
                var brandList = ApiUtil.GetBrandList().Result;
                return View(brandList);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }

        public ActionResult DeleteBrand(int id)
        {
            try
            {
                var res = ApiUtil.DeleteBrand(id);
                return RedirectToAction("ListBrand");
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }
        }
    }
}