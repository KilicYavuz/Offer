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
        static List<Tag> Tags { get; set; }

        public static async Task InitData()
        {
            Tags = GetTagList()?.Result;
        }

        #region ProductTag

        public static async Task<ProductTag> GetProductTag(Guid id)
        {
            var httpResponse = await Get("Management/getProductTag/" + id);
            var tag = JsonConvert.DeserializeObject<ProductTag>(httpResponse);
            return tag;
        }

        public static async Task<string> AddProductTag(ProductTag tag)
        {
            var httpResponse = await Post<ProductTag>("Management/addProductTag", tag);
            return httpResponse;
        }

        public static async Task<string> UpdateProductTag(ProductTag tag)
        {
            var httpResponse = await Post<ProductTag>("Management/updateProductTag", tag);
            return httpResponse;
        }

        public static async Task<List<ProductTag>> GetProductTagList()
        {
            var httpResponse = await Get("Management/getAllCategories");
            var categories = JsonConvert.DeserializeObject<List<ProductTag>>(httpResponse);
            return categories;
        }

        public static async Task<string> DeleteProductTag(Guid id, bool permanent = true)
        {
            var httpResponse = await Get("Management/deleteProductTag/" + id + "/" + permanent.ToString());
            return httpResponse;
        }
        #endregion

        #region Tag

        public static async Task<Tag> GetTag(Guid id)
        {
            var httpResponse = await Get("Management/getTag/" + id);
            var tag = JsonConvert.DeserializeObject<Tag>(httpResponse);
            return tag;
        }

        public static async Task<string> AddTag(Tag tag)
        {
            var httpResponse = await Post<Tag>("Management/addTag", tag);
            return httpResponse;
        }

        public static async Task<string> UpdateTag(Tag tag)
        {
            var httpResponse = await Post<Tag>("Management/updateTag", tag);
            return httpResponse;
        }

        public static async Task<List<Tag>> GetTagList()
        {
            var httpResponse = await Get("Management/getAllTags");
            var categories = JsonConvert.DeserializeObject<List<Tag>>(httpResponse);
            return categories;
        }

        public static async Task<string> DeleteTag(Guid id, bool permanent = true)
        {
            var httpResponse = await Get("Management/deleteTag/" + id + "/" + permanent.ToString());
            return httpResponse;
        }
        #endregion

        #region Category

        public static async Task<Category> GetCategory(Guid id)
        {
            var httpResponse = await Get("Management/getCategory/" + id);
            var product = JsonConvert.DeserializeObject<Category>(httpResponse);
            return product;
        }

        public static async Task<string> AddCategory(Category category)
        {
            var httpResponse = await Post<Category>("Management/addCategory", category);
            return httpResponse;
        }

        public static async Task<string> UpdateCategory(Category category)
        {
            var httpResponse = await Post<Category>("Management/updateCategory", category);
            return httpResponse;
        }

        public static async Task<List<Category>> GetCategoryList()
        {
            var httpResponse = await Get("Management/getAllCategories");
            var categories = JsonConvert.DeserializeObject<List<Category>>(httpResponse);
            return categories;
        }

        public static async Task<string> DeleteCategory(Guid id, bool permanent = true)
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

        public static async Task<Product> GetProduct(Guid id)
        {
            var httpResponse = await Get("Management/getProduct/" + id);
            var product = JsonConvert.DeserializeObject<Product>(httpResponse);
            return product;
        }

        public static async Task<string> UpdateProduct(Product product)
        {
            var httpResponse = await Post<Product>("Management/updateProduct", product);
            return httpResponse;
        }

        public static async Task<string> AddProduct(Product product)
        {
            var httpResponse = await Post<Product>("Management/addProduct", product);
            return httpResponse;
        }

        public static async Task<List<Product>> GetProductList()
        {
            var httpResponse = await Get("Management/getAllProducts");
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse);
            return products;
        }

        public static async Task<string> DeleteProduct(Guid id, bool permanent = true)
        {
            var httpResponse = await Get("Management/deleteProduct/" + id + "/" + permanent.ToString());
            return httpResponse;
        }

        #endregion

        #region HomeProducts

        public static async Task<List<Product>> GetBestSellerProducts()
        {
            var bestSellerTag = Tags.FirstOrDefault(x => x.Name == "BestSeller");
            var httpResponse = await Get("Product/getAllProductsByTag/" + bestSellerTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse) ?? new List<Product>();
            return products;
        }

        public static async Task<List<Product>> GetOpportunityProducts()
        {
            var opprtunityTag = Tags.FirstOrDefault(x => x.Name == "Opportunity");
            var httpResponse = await Get("Product/getAllProductsByTag/" + opprtunityTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse) ?? new List<Product>();
            return products;
        }

        public static async Task<List<Product>> GetNewProducts()
        {
            var newTag = Tags.FirstOrDefault(x => x.Name == "New");
            var httpResponse = await Get("Product/getAllProductsByTag/" + newTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse) ?? new List<Product>();
            return products;
        }

        public static async Task<List<Product>> GetOutletProducts()
        {
            var outletTag = Tags.FirstOrDefault(x => x.Name == "Outlet");
            var httpResponse = await Get("Product/getAllProductsByTag/" + outletTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse) ?? new List<Product>();
            return products;
        }

        public static async Task<List<Product>> GetMainScreenProducts()
        {
            var mainScreenTag = Tags.FirstOrDefault(x => x.Name == "MainScreenProduct");
            var httpResponse = await Get("Product/getAllProductsByTag/" + mainScreenTag?.Oid);
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse) ?? new List<Product>();
            return products;
        }

        #endregion

        #region CategoryProduct

        public static async Task<List<Product>> GetProductByCategory(Guid id)
        {
            var httpResponse = await Get("Product/GetProductByCategory/" + id.ToString());
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse);
            return products;
        }

        #endregion

        #region Brand
        public static async Task<List<Brand>> GetBrandList()
        {
            var httpResponse = await Get("Management/getAllBrands");
            var brands = JsonConvert.DeserializeObject<List<Brand>>(httpResponse);
            return brands;
        }

        public static async Task<Brand> GetBrand(Guid id)
        {
            var httpResponse = await Get("Management/getBrand/" + id.ToString());
            var resp = JsonConvert.DeserializeObject<Brand>(httpResponse);
            return resp;
        }

        public static async Task<string> AddBrand(Brand brand)
        {
            var httpResponse = await Post<Brand>("Management/addBrand/", brand);
            return httpResponse;
        }

        public static async Task<string> UpdateBrand(Brand brand)
        {
            var httpResponse = await Post<Brand>("Management/updateBrand/", brand);
            return httpResponse;
        }

        public static async Task<string> DeleteBrand(Guid id, bool permanent = true)
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

        #region Search

        public static async Task<List<Product>> Search(string key)
        {
            var httpResponse = await Get("Product/search?term=" + key);
            var products = JsonConvert.DeserializeObject<List<Product>>(httpResponse);
            return products;
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
                    return r?.Message;
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
                    //var error = new ErrorApiModel() { Message = res, StatusCode = response.StatusCode.ToString() };
                    //logger.LogError(res);
                    return string.Empty;
                }
                //else if (response.StatusCode == System.Net.HttpStatusCode.NoContent && string.IsNullOrEmpty(res))
                //{
                //    //return error.Message;
                //}

                return res;
            }
        }

        #endregion
    }
}