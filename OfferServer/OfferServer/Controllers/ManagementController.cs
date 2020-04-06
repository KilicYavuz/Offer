﻿using Contracts;
using Entities.Enums;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ManagementController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="ManagementController"/> class.
        /// CrudProduct,CrudCategory,CrudBrand, CrudTag, İçerik (Yazı, fotoğraf), 
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="repoWrapper">The repo wrapper.</param>
        public ManagementController(ILoggerManager logger, IRepositoryWrapper repoWrapper)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
        }

        #region Product

        [HttpGet("getAllProducts")]
        public IActionResult GetAllProducts()
        {
            try
            {
                var products = _repoWrapper.Product.FindAll().OrderBy(u => u.CategoryOid).ToList();

                _logger.LogInfo($"Returned all categories from database.");
                var json = JsonConvert.SerializeObject(products);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllProducts action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getProduct/{id}")]
        public IActionResult GetProduct(Guid id)
        {
            try
            {
                var product = _repoWrapper.Product.GetById(id);

                if (product == null)
                {
                    return NotFound();
                }

                var json = JsonConvert.SerializeObject(product);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("addProduct")]
        public IActionResult AddProduct([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<Products>(postData.ToString());

                _repoWrapper.Product.Add(data);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("updateProduct/{id}")]
        public IActionResult UpdateProduct(Guid id, [FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }

                var data = JsonConvert.DeserializeObject<Products>(postData.ToString());
                
                var product = _repoWrapper.Product.GetById(id);
                if (product == null)
                {
                    return NotFound();
                }

                data.Oid = id;
                _repoWrapper.Product.Update(data);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("deleteProduct/{id}/{permanent}")]
        public IActionResult DeleteProduct(Guid id, bool permanent)
        {
            try
            {
                var data = _repoWrapper.Product.GetById(id);
                if (data == null)
                {
                    return NotFound();
                }

                if (permanent)
                {
                    _repoWrapper.Product.Delete(data);
                }
                else
                {
                    data.State = ItemState.Deleted;
                    data.UpdatedDate = DateTime.Now;
                    _repoWrapper.Product.Update(data);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Category

        [HttpGet("getAllCategories")]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categories = _repoWrapper.Category.FindAll().OrderBy(u => u.ParentOid).ToList();

                _logger.LogInfo($"Returned all categories from database.");
                var json = JsonConvert.SerializeObject(categories);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllCategories action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getCategory/{id}")]
        public IActionResult GetCategory(int id)
        {
            try
            {
                var data = _repoWrapper.Category.GetById(id);
                
                var json = JsonConvert.SerializeObject(data);

                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("addCategory")]
        public IActionResult AddCategory([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<Categories>(postData.ToString());

                _repoWrapper.Category.Add(data);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("updateCategory/{id}")]
        public IActionResult UpdateCategory(int id, [FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }

                var data = JsonConvert.DeserializeObject<Categories>(postData.ToString());

                var product = _repoWrapper.Category.GetById(id);
                if (product == null)
                {
                    return NotFound();
                }

                data.Oid = id;
                _repoWrapper.Category.Update(data);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("deleteCategory/{id}/{permanent}")]
        public IActionResult DeleteCategory(int id, bool permanent)
        {
            try
            {
                var data = _repoWrapper.Category.GetById(id);
                if (data == null)
                {
                    return NotFound();
                }

                if (permanent)
                {
                    _repoWrapper.Category.Delete(data);
                }
                else
                {
                    data.State = ItemState.Deleted; 
                    data.UpdatedDate = DateTime.Now;
                    _repoWrapper.Category.Update(data);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion
    }
}
