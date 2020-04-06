using Contracts;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
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

        [HttpGet("getAll")]
        public IActionResult GetAll()
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
    }
}
