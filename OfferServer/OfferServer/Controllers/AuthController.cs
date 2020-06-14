using Contracts;
using Entities;
using LoggerService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using OfferServer.TokenAuth;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace OfferServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Auth : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IRepositoryWrapper _repoWrapper;
        private readonly IConfiguration _configuration;

        public Auth(ILoggerManager logger, IRepositoryWrapper repoWrapper, IConfiguration configuration)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(object postData)
        {
            var loginData = JsonConvert.DeserializeObject<LoginData>(postData.ToString());//postData.ToObject<LoginData>();
            var userData = _repoWrapper.User.FindByCondition(x => x.Email == loginData.Email && x.Password == loginData.Password).FirstOrDefault();
            if (userData != null)
            {
                TokenHandler tokenHandler = new TokenHandler(_configuration);
                Token token = tokenHandler.CreateAccessToken(userData);

                //Refresh token Users tablosuna işleniyor.
                userData.AccesToken = token.AccessToken;
                userData.RefreshToken = token.RefreshToken;
                userData.RefreshTokenEndDate = token.Expiration.AddMinutes(3);
                await _repoWrapper.SaveAsync();
                return Ok(token);
            }
            return NotFound();
        }

        [HttpGet("refreshTokenLogin")]
        public async Task<IActionResult> RefreshTokenLogin([FromForm] string refreshToken)
        {
            var user = _repoWrapper.User.FindByCondition(x => x.RefreshToken == refreshToken).FirstOrDefault();
            if (user != null && user?.RefreshTokenEndDate > DateTime.Now)
            {
                TokenHandler tokenHandler = new TokenHandler(_configuration);
                Token token = tokenHandler.CreateAccessToken(user);

                user.RefreshToken = token.RefreshToken;
                user.RefreshTokenEndDate = token.Expiration.AddMinutes(3);
                await _repoWrapper.SaveAsync();

                return Ok(token);
            }
            return NotFound();
        }
    }
}
