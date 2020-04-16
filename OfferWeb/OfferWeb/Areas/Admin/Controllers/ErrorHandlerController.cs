using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ErrorHandlerController : Controller
    {
        public ActionResult Index(string data)
        {
            ViewBag.Message = data;
            return View();
        }

        public ActionResult NotFound()
        {
            return View();
        }

        public ActionResult Unauthorized()
        {
            return View();
        }
    }
}