using Contracts;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Auth : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;

        public Auth(ILoggerManager logger, IRepositoryWrapper repoWrapper)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
        }        
        
        [HttpPost("login")]
        public IActionResult Login(object postData)
        {
            var loginData = JsonConvert.DeserializeObject<LoginData>(postData.ToString());//postData.ToObject<LoginData>();
            var userData = _repoWrapper.User.FindByCondition(x => x.Email == loginData.Email && x.Password == loginData.Password).FirstOrDefault();
            
            return Ok(new { UserData = userData });
        }
    }
}
