using Entities;
using Entities.Models;
using Newtonsoft.Json;
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
        static string url = ConfigurationManager.AppSettings["api_url"];

        #region Category

        public static async Task<string> CreateCategory(Categories category)
        {
            var httpResponse = await Post<Categories>("Management/addCategory", category);
            return httpResponse;
        }

        public static async Task<List<Categories>> GetCategoryList()
        {
            var httpResponse = await Get("Management/getAllCategories");
            var categories = JsonConvert.DeserializeObject<List<Categories>>(httpResponse);
            return categories;
        }
        #endregion

        #region Product

        public static async Task<Products> GetProduct(int id)
        {
            var httpResponse = await Get("Management/getProduct/"+ id);
            //if(string.IsNullOrEmpty(httpResponse))
            //{
            //    return null;
            //}
            var product = JsonConvert.DeserializeObject<Products>(httpResponse);
            return product;
        }

        internal static async Task<string> UpdateProduct(Products product)
        {
            var httpResponse = await Post<Products>("Management/updateProduct", product);
            return httpResponse;
        }

        public static async Task<string> AddProduct(Products product)
        {
            var httpResponse = await Post<Products>("Management/addProduct", product);
            return httpResponse;
        }

        public static async Task<string> GetProductList()
        {
            var httpResponse = await Get("Management/getAllProducts");
            return httpResponse;
        }

        public static async Task<string> DeleteProduct(Guid id)
        {
            var httpResponse = await Get("Management/deleteProduct/" + id);
            return httpResponse;
        }

        #endregion

        #region Brand
        public static async Task<List<Brands>> GetBrandList()
        {
            var httpResponse = await Get("Management/getAllBrands");
            var brands = JsonConvert.DeserializeObject<List<Brands>>(httpResponse);
            return brands;
        }

        public static async Task<Brands> GetBrand(int id)
        {
            var httpResponse = await Get("Management/getBrand/"+id);
            var resp = JsonConvert.DeserializeObject<Brands>(httpResponse);
            return resp;
        }

        public static async Task<string> AddBrand(Brands brand)
        {
            var httpResponse = await Post<Brands>("Management/addBrand/",brand);
            return httpResponse;
        }

        public static async Task<string> UpdateBrand(Brands brand)
        {
            var httpResponse = await Post<Brands>("Management/updateBrand/",brand);
            return httpResponse;
        }

        public static async Task<string> DeleteBrand(int id)
        {
            var httpResponse = await Get("Management/deleteBrand/"+id);
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
            using (HttpResponseMessage response = await client.PostAsync(serviceUrl, httpContent).ConfigureAwait(false))
            {
                string res = await response.Content.ReadAsStringAsync();
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    var r = JsonConvert.DeserializeObject<ErrorApiModel>(res);
                    return r.Message;
                }
                return res;
            }
        }

        public static async Task<string> Get(string method)
        {
            if (string.IsNullOrEmpty(url))
                throw new Exception("api url not defined");
            serviceUrl = $"{url}{method}";
            using (HttpResponseMessage response = await client.GetAsync(serviceUrl).ConfigureAwait(false))
            {
                string res = await response.Content.ReadAsStringAsync();
                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    var r = JsonConvert.DeserializeObject<ErrorApiModel>(res);
                    //TODO: hata sonucu hata ayfasına yönlenecek.
                    return r.Message;
                }
                return res;
            }
        }

        #endregion
    }
}