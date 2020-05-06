using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace OfferWeb.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class HomeController : Controller
    {
        // GET: Admin/Home
        public ActionResult Index()
        {
            try
            {
                return View();
            }
            catch (System.Exception ex)
            {
                return RedirectToAction("Index", new RouteValueDictionary(new { controller = "ErrorHandler", action = "Index", data = ex.InnerException?.Message ?? ex.Message }));
            }
        }
    }
}