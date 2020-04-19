using Entities;
using Entities.Models;
using LoggerService;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace OfferWeb.API
{
    public class ApiUtil
    {
        [Inject]
        static LoggerManager logger { get; set; }
        static string serviceUrl = "";
        static HttpClient client = new HttpClient();
        static string url = Startup.StaticConfig["Root:ApiUrl"];
        static List<Tags> Tags { get; set; }

        public static async Task InitData()
        {
            Tags = GetTagList()?.Result;
        }

        #region ProductTag

        public static async Task<ProductTags> GetProductTag(Guid id)
        {
            var httpResponse = await Get("Management/getProductTag/" + id);
            var tag = JsonConvert.DeserializeObject<ProductTags>(httpResponse);
            return tag;
        }

        public static async Task<string> AddProductTag(ProductTags tag)
        {
            var httpResponse = await Post<ProductTags>("Management/addProductTag", tag);
            return httpResponse;
        }

        public static async Task<string> UpdateProductTag(ProductTags tag)
        {
            var httpResponse = await Post<ProductTags>("Management/updateProductTag", tag);
            return httpResponse;
        }

        public static async Task<List<ProductTags>> GetProductTagList()
        {
            var httpResponse = await Get("Management/getAllCategories");
            var categories = JsonConvert.DeserializeObject<List<ProductTags>>(httpResponse);
            return categories;
        }

        public static async Task<string> DeleteProductTag(Guid id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteProductTag/" + id + "/" + permanent.ToString());
            return httpResponse;
        }
        #endregion

        #region Tag

        public static async Task<Tags> GetTag(Guid id)
        {
            var httpResponse = await Get("Management/getTag/" + id);
            var tag = JsonConvert.DeserializeObject<Tags>(httpResponse);
            return tag;
        }

        public static async Task<string> AddTag(Tags tag)
        {
            var httpResponse = await Post<Tags>("Management/addTag", tag);
            return httpResponse;
        }

        public static async Task<string> UpdateTag(Tags tag)
        {
            var httpResponse = await Post<Tags>("Management/updateTag", tag);
            return httpResponse;
        }

        public static async Task<List<Tags>> GetTagList()
        {
            var httpResponse = await Get("Management/getAllTags");
            var categories = JsonConvert.DeserializeObject<List<Tags>>(httpResponse);
            return categories;
        }

        public static async Task<string> DeleteTag(Guid id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteTag/" + id + "/" + permanent.ToString());
            return httpResponse;
        }
        #endregion

        #region Category

        public static async Task<Categories> GetCategory(Guid id)
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

        public static async Task<string> DeleteCategory(Guid id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteCategory/" + id + "/" + permanent.ToString());
            return httpResponse;
        }
        #endregion

        #region Cart
        public static async Task<string> AddCart(Guid id)
        {
            var httpResponse = await Get("Management/addCart/" + id);
            return httpResponse;
        }
        #endregion

        #region Product

        public static async Task<Products> GetProduct(Guid id)
        {
            var httpResponse = await Get("Management/getProduct/" + id);
            var product = JsonConvert.DeserializeObject<Products>(httpResponse);
            return product;
        }

        public static async Task<string> UpdateProduct(Products product)
        {
            var httpResponse = await Post<Products>("Management/updateProduct", product);
            return httpResponse;
        }

        public static async Task<string> AddProduct(Products product)
        {
            var httpResponse = await Post<Products>("Management/addProduct", product);
            return httpResponse;
        }

        public static async Task<List<Products>> GetProductList()
        {
            var httpResponse = await Get("Management/getAllProducts");
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse);
            return products;
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
            var bestSellerTag = Tags.FirstOrDefault(x => x.Name == "BestSeller");
            var httpResponse = await Get("Product/getAllProductsByTag/" + bestSellerTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse) ?? new List<Products>();
            return products;
        }

        public static async Task<List<Products>> GetOpportunityProducts()
        {
            var opprtunityTag = Tags.FirstOrDefault(x => x.Name == "Opprtunity");
            var httpResponse = await Get("Product/getAllProductsByTag/" + opprtunityTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse) ?? new List<Products>();
            return products;
        }

        public static async Task<List<Products>> GetNewProducts()
        {
            var newTag = Tags.FirstOrDefault(x => x.Name == "NewProduct");
            var httpResponse = await Get("Product/getAllProductsByTag/" + newTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse) ?? new List<Products>();
            return products;
        }

        public static async Task<List<Products>> GetOutletProducts()
        {
            var outletTag = Tags.FirstOrDefault(x => x.Name == "OutletProduct");
            var httpResponse = await Get("Product/getAllProductsByTag/"+ outletTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse) ?? new List<Products>();
            return products;
        }

        public static async Task<List<Products>> GetMainScreenProducts()
        {
            var mainScreenTag = Tags.FirstOrDefault(x => x.Name == "MainScreenProduct");
            var httpResponse = await Get("Product/getAllProductsByTag/" + mainScreenTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Products>>(httpResponse) ?? new List<Products>();
            return products;
        }

        #endregion

        #region CategoryProduct

        public static async Task<List<Products>> GetProductByCategory(Guid id)
        {
            var httpResponse = await Get("Product/GetProductByCategory/" + id.ToString());
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

        public static async Task<Brands> GetBrand(Guid id)
        {
            var httpResponse = await Get("Management/getBrand/" + id.ToString());
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
            var httpResponse = await Post<Brands>("Management/updateBrand/" + brand.Oid, brand);
            return httpResponse;
        }

        public static async Task<string> DeleteBrand(Guid id, bool permanent = false)
        {
            var httpResponse = await Get("Management/deleteBrand/" + id.ToString() + "/" + permanent.ToString());
            return httpResponse;
        }


        #endregion

        #region User
        public static async Task<string> AddWishList(Guid id)
        {
            var httpResponse = await Get("Interaction/addWishList/" + id.ToString());
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
            {
                var error = "api url not defined";
                logger.LogError(error);
                throw new Exception(error);
            }
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