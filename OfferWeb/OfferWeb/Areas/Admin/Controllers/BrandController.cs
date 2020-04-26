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
                    return View(new Brand());
                }
                else
                {
                    var brand = ApiUtil.GetBrand(id.Value)?.Result;
                    return View(brand);
                }
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException }));
            }

        }

        public ActionResult SaveBrand(Brand model)
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
                    var res = ApiUtil.AddBrand(model).Result;
                }
                else
                {
                    var res = ApiUtil.UpdateBrand(model).Result;
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