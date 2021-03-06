﻿using Contracts;
using LoggerService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="RequestController"/> class.
        /// All of Requests and Offers
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="repoWrapper">The repo wrapper.</param>
        public RequestController(ILoggerManager logger, IRepositoryWrapper repoWrapper)
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
    }
}
