using Newtonsoft.Json;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace OfferWeb.API
{
    public class ApiUtil
    {
        static string serviceUrl = "";
        static HttpClient client = new HttpClient();
        static string url= ConfigurationManager.AppSettings["api_url"];

        #region Category

        public static async Task<string> CreateCategory(Categories category)
        {
            var httpResponse = await Post<Categories>("Management/addCategory", category);
            return httpResponse;
        }

        public static async Task<string> GetCategoryList()
        {
            var httpResponse = await Get("Management/getAllCategories");
            return httpResponse;
        }
        #endregion

        #region Product

        internal static object GetProduct(int id)
        {
            var httpResponse = await Post<Categories>("Management/getProduct", id);
            return httpResponse;
        }

        public static async Task<string> AddProduct(Products product)
        {
            var httpResponse = await Post<Products>("Product/addProduct", product);
            return httpResponse;
        }

        public static async Task<string> GetProductList()
        {
            var httpResponse = await Get("Product/getAllProducts");
            return httpResponse;
        }

        #endregion

        #region Brand
        public static async Task<string> GetBrandList()
        {
            var httpResponse = await Get("Management/getAllBrands");
            return httpResponse;
        }

        public static async Task<string> GetBrandList()
        {
            var httpResponse = await Get("Management/getAllBrands");
            return httpResponse;
        }


        #endregion

        #region Generic Methods

        public async static Task<string> Post<T>(string method, T instance) where T : class, new()
        {
            if (string.IsNullOrEmpty(url))
                throw new Exception("api url not defined");
            serviceUrl = $"{url}{method}";

            StringContent httpContent = new StringContent(JsonConvert.SerializeObject(instance), Encoding.UTF8, "application/json");
            httpContent.Headers.Add("3cb6b530-adda-40d3-bcf8-02f65b90e437", "6bd3e1f9-d0f6-41db-aa4a-178c2776feeb");
            //httpContent.Headers.Add("cache-control", "no-cache");

            using (HttpResponseMessage response = await client.PostAsync(serviceUrl, httpContent).ConfigureAwait(false))
            {
                //var t = new Task<string>(() => { return response.StatusCode.ToString(); });
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    string res = await response.Content.ReadAsStringAsync();
                    var definition = new { HataKodu = "", Mesaj = "" };
                    var r = JsonConvert.DeserializeAnonymousType(res, definition);
                    return r.Mesaj;
                }
            }
            return "";

        }

        public static async Task<string> Get(string method)
        {
            if (string.IsNullOrEmpty(url))
                throw new Exception("api url not defined");
            serviceUrl = $"{url}{method}";
            using (HttpResponseMessage response = await client.GetAsync(serviceUrl).ConfigureAwait(false))
            {
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    string res = await response.Content.ReadAsStringAsync();
                    var definition = new { HataKodu = "", Mesaj = "" };
                    var r = JsonConvert.DeserializeAnonymousType(res, definition);
                    return r.Mesaj;
                }
            }
            return "";
        }

        #endregion
    }
}