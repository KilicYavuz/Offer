using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OfferWeb.Helpers
{
    [AttributeUsage(AttributeTargets.Method)]
    public class IgnoreAttribute : Attribute
    {
    }
}
