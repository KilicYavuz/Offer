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
    public class BrandController : Controller
    {
        // GET: Admin/Brand
        public ActionResult AddBrand(Guid? id)
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
                var image = Util.GetBase64FromImage(brand.ImageFile);
                if (!string.IsNullOrEmpty(image))
                {
                    brand.Image = Util.GetBase64FromImage(brand.ImageFile);
                }
                brand.ImageFile = null;
                if (brand.Oid == Guid.Empty)
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

        public ActionResult DeleteBrand(Guid id)
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