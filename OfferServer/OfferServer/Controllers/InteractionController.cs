using Contracts;
using LoggerService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InteractionController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="InteractionController"/> class.
        /// Notifications, Favorites, Comments, likes
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="repoWrapper">The repo wrapper.</param>
        public InteractionController(ILoggerManager logger, IRepositoryWrapper repoWrapper)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
        }
        
        [HttpGet("addWishList/{id}")]
        public IActionResult AddWishList(Guid id)
        {
            try
            {
                var product = _repoWrapper.Product.GetById(id);

                if (product == null)
                {
                    return NotFound();
                }

                var json = JsonConvert.SerializeObject(product);
                
                ///TODO:addWishList
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetTag action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
