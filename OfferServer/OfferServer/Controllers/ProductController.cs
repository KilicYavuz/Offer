using Contracts;
using Entities;
using LoggerService;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductController"/> class.
        /// ListOfProducts, ListOfCategory, CrudSupplierPruduct,
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="repoWrapper">The repo wrapper.</param>
        public ProductController(ILoggerManager logger, IRepositoryWrapper repoWrapper)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
        }

        #region Product

        [HttpGet("getProduct/{id}")]
        public IActionResult GetProduct(Guid id)
        {
            try
            {
                var product = _repoWrapper.Product.FindByCondition(x => x.Oid == id, i => i.Brand, i => i.Category, i => i.ProductOptions, i => i.ProductTags).FirstOrDefault();

                if (product == null)
                {
                    return NotFound();
                }

                product.SelectedTags = product.ProductTags.Select(x => x.TagOid).ToList();
                var json = JsonConvert.SerializeObject(product);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getAllProductsByTag/{tagId}")]
        public IActionResult GetAllProductsByTag(Guid? tagId)
        {
            try
            {
                List<Product> products;
                if (!tagId.HasValue || Guid.Empty == tagId)
                {
                    products = _repoWrapper.Product.FindAll().OrderBy(u => u.CategoryOid).ToList();
                }
                else
                {
                   products = _repoWrapper.ProductTag.FindByCondition(x=>x.Tag.Oid == tagId.Value && x.Product.Verified && x.Product.State == Entities.Enums.ItemState.Active, i=>i.Product,i=>i.Product.Brand, i => i.Product.Category, i => i.Product.ProductTags)
                        .Select(s=>s.Product).ToList();
                        //.OrderByDescending(u=>u.CreatedDate).ThenBy(u =>u.Product.CategoryOid)
                }
                var json = JsonConvert.SerializeObject(products);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllProductsByTag action: {ex.Message}");
                ErrorApiModel eam = new ErrorApiModel();
                eam.Message = $"Something went wrong inside GetAllProductsByTag action: {ex.Message}";
                eam.StatusCode = "500";
                return StatusCode(500, eam);
            }
        }

        [HttpGet("getProductByCategory/{id}")]
        public IActionResult GetProductByCategory(Guid id)
        {
            try
            {
                var products = _repoWrapper.Product
                    .FindByCondition(x=>x.State == Entities.Enums.ItemState.Active && /*x.Verified && */ x.CategoryOid == id,
                    i=>i.Brand,i=>i.Category,i=>i.ProductTags, i=>i.ProductOptions).OrderByDescending(u => u.CreatedDate).ToList();

                var json = JsonConvert.SerializeObject(products);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProductByCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getProductByBrand/{id}")]
        public IActionResult GetProductByBrand(Guid id)
        {
            try
            {
                var products = _repoWrapper.Product
                    .FindByCondition(x=>x.State == Entities.Enums.ItemState.Active && /*x.Verified &&*/ x.BrandOid == id, 
                    i=>i.Brand,i=>i.Category,i=>i.ProductTags, i=>i.ProductOptions).OrderByDescending(u => u.CreatedDate).ToList();

                var json = JsonConvert.SerializeObject(products);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProductByCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("searchproduct")]
        public IActionResult SearchProduct()
        {
            try
            {
                var term = HttpContext.Request.Query["term"].ToString();
                var categoryId = HttpContext.Request.Query["categoryid"].ToString();
                var predicate = PredicateBuilder.True<Product>();

                if (!string.IsNullOrEmpty(categoryId))
                {
                    predicate = predicate.And(x=>x.CategoryOid == Guid.Parse(categoryId));
                }

                predicate.And(x => x.Name.Contains(term) || x.Description.Contains(term) || x.ShortDescription.Contains(term) || x.Category.Name.Contains(term));

                var products = _repoWrapper.Product.FindByCondition(predicate, i=>i.Category).ToList();

                if (products == null)
                {
                    return NotFound();
                }

                var json = JsonConvert.SerializeObject(products);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        #endregion

        #region Category
        [HttpGet("getAllCategories")]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categories = _repoWrapper.Category.FindByCondition(x=>x.State == Entities.Enums.ItemState.Active, i=>i.SubCategories, i=> i.ParentCategory).OrderBy(u => u.Name).ToList();

                var json = JsonConvert.SerializeObject(categories);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllCategories action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
        #endregion
    }
}
