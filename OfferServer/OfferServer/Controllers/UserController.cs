using Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class User : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        public User(ILoggerManager logger, IRepositoryWrapper repoWrapper)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
        }
        
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    var domesticAddress = _repoWrapper.Address.FindByCondition(x => x.AddressName.Equals("Domestic"));
        //    var users = _repoWrapper.User.FindAll();

        //    return new string[] { "value1", "value2" };
        //}

        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _repoWrapper.User.GetAllUsers();

                _logger.LogInfo($"Returned all users from database.");

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllUsers action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
