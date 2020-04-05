using Contracts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

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

        [HttpGet("GetAllProducts")]
        public IActionResult GetAllProducts()
        {
            try
            {
                var products = _repoWrapper.Product.GetAll();

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

        [HttpGet("{id}", Name = "GetProduct")]
        public IActionResult GetProduct(Guid id)
        {
            try
            {
                var product = _repoWrapper.Product.GetById(id);

                _logger.LogInfo($"Returned all categories from database.");
                var json = JsonConvert.SerializeObject(product);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Category

        [HttpGet("GetAllCategories")]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categories = _repoWrapper.Category.GetAll();

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

        [HttpGet("{id}", Name = "GetProduct")]
        public IActionResult GetCategory(int id)
        {
            try
            {
                var product = _repoWrapper.Category.GetById(id);

                _logger.LogInfo($"Returned all categories from database.");
                var json = JsonConvert.SerializeObject(product);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion
    }
}
