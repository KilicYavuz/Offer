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

        public ActionResult SaveTag(Tags tag)
        {
            if (tag.Oid == 0)
            {
                var res = ApiUtil.AddTag(tag).Result;
            }
            else
            {
                var res = ApiUtil.UpdateTag(tag).Result;
            }
            return RedirectToAction("ListTag");
        }

        public ActionResult ListTag()
        {
            var tagList = ApiUtil.GetTagList().Result;
            return View(tagList);
        }

        public ActionResult DeleteTag(int id)
        {
            var res = ApiUtil.DeleteTag(id);
            return RedirectToAction("ListTag");
        }
    }
}