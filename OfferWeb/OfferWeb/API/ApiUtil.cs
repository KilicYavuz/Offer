using Entities;
using Entities.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace OfferWeb.API
{
    public class ApiUtil
    {
        static string serviceUrl = "";
        static HttpClient client = new HttpClient();
        static string url = Startup.StaticConfig["api_url"];
        #region Category

        public static async Task<Categories> GetCategory(int id)
        {
            var httpResponse = await Get("Management/getCategory/" + id);
            var product = JsonConvert.DeserializeObject<Categories>(httpResponse);
            return product;
        }

        public static async Task<string> AddCategory(Categories category)
        {
            var httpResponse = await Post<Categories>("Management/addCategory", category);
            return httpResponse;
        }

        public static async Task<string> UpdateCategory(Categories category)
        {
            var httpResponse = await Post<Categories>("Management/updateCategory", category);
            return httpResponse;
        }

        public static async Task<List<Categories>> GetCategoryList()
        {
            var httpResponse = await Get("Management/getAllCategories");
            var categories = JsonConvert.DeserializeObject<List<Categories>>(httpResponse);
            return categories;
        }

        public static async Task<string> DeleteCategory(int id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteCategory/" + id + "/" + permanent.ToString());
            return httpResponse;
        }
        #endregion

        #region Product

        public static async Task<Products> GetProduct(int id)
        {
            var httpResponse = await Get("Management/getProduct/" + id);
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

        public static async Task<string> DeleteProduct(Guid id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteProduct/" + id + "/" + permanent.ToString());
            return httpResponse;
        }

        #endregion

        #region HomeProducts

        public static async Task<List<Products>> GetBestSellerProducts()
        {
            var httpResponse = await Get("Management/bestSellerProducts");
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse);
            return products;
        }

        public static async Task<List<Products>> GetOpportunityProducts()
        {
            var httpResponse = await Get("Management/getOpportunityProducts");
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse);
            return products;
        }

        public static async Task<List<Products>> GetNewProducts()
        {
            var httpResponse = await Get("Management/getNewProducts");
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse);
            return products;
        }

        public static async Task<List<Products>> GetOutletProducts()
        {
            var httpResponse = await Get("Management/getOutletProducts");
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse);
            return products;
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
            var httpResponse = await Get("Management/getBrand/" + id);
            var resp = JsonConvert.DeserializeObject<Brands>(httpResponse);
            return resp;
        }

        public static async Task<string> AddBrand(Brands brand)
        {
            var httpResponse = await Post<Brands>("Management/addBrand/", brand);
            return httpResponse;
        }

        public static async Task<string> UpdateBrand(Brands brand)
        {
            var httpResponse = await Post<Brands>("Management/updateBrand/", brand);
            return httpResponse;
        }

        public static async Task<string> DeleteBrand(int id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteBrand/" + id + "/" + permanent.ToString());
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
                if (response.StatusCode != System.Net.HttpStatusCode.OK && response.StatusCode != System.Net.HttpStatusCode.NoContent)
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

                if (response.StatusCode != System.Net.HttpStatusCode.OK && response.StatusCode != System.Net.HttpStatusCode.NoContent)
                {
                    var r = JsonConvert.DeserializeObject<ErrorApiModel>(res);
                    //TODO: hata sonucu hata ayfasına yönlenecek.
                    //return r.Message;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NoContent && string.IsNullOrEmpty(res))
                {
                    var error = new ErrorApiModel() { Message = "It should not happen; response is empty.", StatusCode = "ERR404" };
                    //return error.Message;
                }

                return res;
            }
        }

        #endregion
    }
}