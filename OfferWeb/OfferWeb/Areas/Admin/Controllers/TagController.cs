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
    public class TagController : Controller
    {
        // GET: Admin/Tag
        public ActionResult AddTag(Guid? id)
        {
            try
            {
                if (id == null)
                {
                    return View(new Tag());
                }
                else
                {
                    var tag = ApiUtil.GetTag(id.Value);
                    return View(tag.Result);
                }
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }
        }

        public ActionResult SaveTag(Tag tag)
        {
            try
            {
                if (tag.Oid == Guid.Empty)
                {
                    var res = ApiUtil.AddTag(tag).Result;
                }
                else
                {
                    var res = ApiUtil.UpdateTag(tag).Result;
                }
                return RedirectToAction("ListTag");
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }

        }

        public ActionResult ListTag()
        {
            try
            {
                var tagList = ApiUtil.GetTagList().Result;
                return View(tagList);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }

        }

        public ActionResult DeleteTag(Guid id)
        {
            try
            {
                var res = ApiUtil.DeleteTag(id);
                return RedirectToAction("ListTag");
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }

        }
    }
}