﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    public class SharedController : Controller
    {
        // GET: Admin/Shared
        public ActionResult _Layout()
        {
            return View();
        }
    }
}