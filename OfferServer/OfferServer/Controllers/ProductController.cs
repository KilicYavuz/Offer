using Contracts;
using Entities;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

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

        [HttpGet("getAllProductsByTag/{tagId}")]
        public IActionResult GetAllProductsByTag(int? tagId)
        {
            try
            {
                List<Products> products;
                if (!tagId.HasValue || tagId == 0)
                {
                    products = _repoWrapper.Product.FindAll().OrderBy(u => u.CategoryOid).ToList();
                }
                else
                {
                   products = _repoWrapper.ProductTag.FindByCondition(x=>x.Tags.Oid == tagId.Value && x.Product.Verified && x.Product.State == Entities.Enums.ItemState.Active, i=>i.Product,i=>i.Product.Brand, i => i.Product.Category, i => i.Product.ProductTags).OrderBy(u => u.Product.CategoryOid).Select(s=>s.Product).ToList();
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

        [HttpGet("getAllCategories")]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categories = _repoWrapper.Category.FindByCondition(x=>x.State == Entities.Enums.ItemState.Active, i=>i.SubCategories, i=> i.ParentCategory).OrderBy(u => u.ParentOid).ToList();

                var json = JsonConvert.SerializeObject(categories);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllCategories action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getProductByCategory/{id}")]
        public IActionResult GetProductByCategory(int id)
        {
            try
            {
                var products = _repoWrapper.Product.FindByCondition(x=>x.State == Entities.Enums.ItemState.Active && x.Verified && x.CategoryOid == id, i=>i.Brand,i=>i.Category,i=>i.ProductTags).OrderBy(u => u.CategoryOid).ToList();

                var json = JsonConvert.SerializeObject(products);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProductByCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
