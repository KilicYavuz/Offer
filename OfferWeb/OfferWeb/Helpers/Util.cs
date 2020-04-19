using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace OfferWeb.Helpers
{
    public static class Util
    {
        public static string GetBase64FromImage(IFormFile file)
        {
            using (var target = new MemoryStream())
            {
                file.CopyTo(target);
                string base64String = Convert.ToBase64String(target.ToArray());
                return base64String;
            }
        }
    }
}
