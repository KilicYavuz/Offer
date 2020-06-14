using Contracts;
using Entities.Models;
using LoggerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace OfferServer.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="SalesController"/> class.
        /// Cart, Sales(Chaeckout), Orders
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="repoWrapper">The repo wrapper.</param>
        public SalesController(ILoggerManager logger, IRepositoryWrapper repoWrapper)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
        }

        //[HttpGet("GetAllUsers")]
        //public IActionResult GetAllUsers()
        //{
        //    try
        //    {
        //        var users = _repoWrapper.User.GetAllUsers();

        //        _logger.LogInfo($"Returned all users from database.");
        //        var json = JsonConvert.SerializeObject(users);
        //        return Ok(json);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Something went wrong inside GetAllUsers action: {ex.Message}");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}


        #region Order

        [HttpPost("addOrder")]
        public IActionResult AddOrder([FromBody] object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<Order>(postData.ToString());


                _repoWrapper.Order.Add(data);
                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddProduct action: {ex.InnerException?.Message ?? ex.Message}");
                _logger.LogError($"Something went wrong inside AddProduct action: {ex.StackTrace}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region OrderProuct
        [HttpPost("addOrderProduct")]
        public IActionResult AddOrderProduct([FromBody] object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<OrderProduct>(postData.ToString());


                _repoWrapper.OrderProduct.Add(data);
                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddProduct action: {ex.InnerException?.Message ?? ex.Message}");
                _logger.LogError($"Something went wrong inside AddProduct action: {ex.StackTrace}");
                return StatusCode(500, "Internal server error");
            }
        }
        #endregion

    }
}
