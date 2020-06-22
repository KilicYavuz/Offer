using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace OfferWeb.Controllers
{
    public class AccountController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Hesabim()
        {
            return View();
        }

        public ActionResult Magazam()
        {
            return View();
        }

        public ActionResult Siparisler()
        {
            return View();
        }

        public ActionResult Favoriler()
        {
            return View();
        }

        public ActionResult Yorumlar()
        {
            return View();
        }

        public ActionResult UrunTalepleri()
        {
            return View();
        }
    }
}
