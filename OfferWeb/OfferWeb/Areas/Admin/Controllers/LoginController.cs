using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace OfferWeb.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class LoginController : Controller
    {
        // GET: Admin/Login
        public ActionResult Index()
        {
            return View(new Users());
        }

        public ActionResult Login(Users user)
        {
            if (user.Username == "Admin" && user.Password == "1")
            {
                return RedirectToAction("Index", "Home");
            }

            return RedirectToAction("Index");
        }

        public ActionResult Logout()
        {
            return RedirectToAction("Index");
        }
    }
}