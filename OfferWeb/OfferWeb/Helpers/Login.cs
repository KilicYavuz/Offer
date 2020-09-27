using Microsoft.AspNetCore.Mvc.Filters;
using OfferWeb.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OfferWeb.Helpers
{
    public class LoginFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            throw new NotImplementedException();
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            string actionName = (string)context.RouteData.Values["action"];
            string controllerName = (string)context.RouteData.Values["controller"];
            var controller = (HomeController)context.Controller;

            //if (HasIgnoreAttribute(context))
            //    return;
            context.HttpContext.Session.TryGetValue("token", out var result);
            if(result == null)
            {
                context.Result = controller.RedirectToAction("Login", "Home");
            }
            else
            {
                //string refreshToken = IsRefreshToken(result, context);
                //if(!string.IsNullOrWhiteSpace(refreshToken))
                //{
                //    context.Result = controller.RedirectToAction(actionName, controllerName, new { tokrn = refreshToken });
                //}
            }

        }
    }
}
