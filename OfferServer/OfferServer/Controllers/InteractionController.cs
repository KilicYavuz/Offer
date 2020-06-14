using Contracts;
using Entities;
using Entities.Models;
using LoggerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace OfferServer.Controllers
{
    [Authorize]
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

        #region Favori

        [HttpGet("addWishList/{id}/{userId}")]
        public IActionResult AddWishList(Guid id, Guid userId)
        {
            try
            {
                var favList = _repoWrapper.FavoriteList.FindByCondition(x => x.UserOid == userId).FirstOrDefault();

                if (favList == null)
                {
                    favList = new FavoriteList();
                    favList.Oid = Guid.NewGuid();
                    favList.State = Entities.Enums.ItemState.Active;
                    favList.UserOid = userId;
                    favList.CreatedDate = DateTime.Now;
                    favList.ListName = "Favori Listem 1";
                    _repoWrapper.FavoriteList.Add(favList);
                }

                var fl = new FavoriteListItem();
                fl.Oid = Guid.NewGuid();
                fl.CreatedDate = DateTime.Now;
                fl.FavoriteListOid = favList.Oid;
                fl.ProductOid = id;

                _repoWrapper.FavoriteListItem.Add(fl);
                _repoWrapper.Save();

                ///TODO:addWishList

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetTag action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("deleteFavoriteItem/{productId}")]
        public IActionResult DeleteFavoriteItem(Guid productId)
        {
            try
            {
                _repoWrapper.FavoriteListItem.Delete(_repoWrapper.FavoriteListItem.FindByCondition(x => x.ProductOid == productId).FirstOrDefault());
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllProducts action: {ex.Message}");
                ErrorApiModel eam = new ErrorApiModel();
                eam.Message = $"Something went wrong inside GetAllProducts action: {ex.Message}";
                eam.StatusCode = "500";
                return StatusCode(500, eam);
            }
        }

        [HttpGet("getWishList/{userId}")]
        public IActionResult GetWishList(Guid userId)
        {
            try
            {
                ICollection<FavoriteListItem> favoriteListItems = _repoWrapper.FavoriteList.FindByCondition(x => x.UserOid == userId).ToList().Select(y => y.FavoriteListItems).FirstOrDefault();
                var json = JsonConvert.SerializeObject(favoriteListItems);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllProducts action: {ex.Message}");
                ErrorApiModel eam = new ErrorApiModel();
                eam.Message = $"Something went wrong inside GetAllProducts action: {ex.Message}";
                eam.StatusCode = "500";
                return StatusCode(500, eam);
            }
        }

        #endregion

        #region Yorum

        [HttpPost("addComment")]
        public IActionResult AddComment([FromBody] object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<Comment>(postData.ToString());

                data.Oid = Guid.NewGuid();
                data.CreatedDate = DateTime.Now;

                _repoWrapper.Comment.Add(data);
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

        [HttpGet("getCommentListForProduct/{id}")]
        public IActionResult GetCommentListForProduct(Guid productId)
        {
            try
            {
                var comments = _repoWrapper.Comment.FindByCondition(x => x.ProductOid == productId).ToList();
                var json = JsonConvert.SerializeObject(comments);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllProducts action: {ex.Message}");
                ErrorApiModel eam = new ErrorApiModel();
                eam.Message = $"Something went wrong inside GetAllProducts action: {ex.Message}";
                eam.StatusCode = "500";
                return StatusCode(500, eam);
            }
        }

        [HttpGet("deleteComment/{id}")]
        public IActionResult DeleteComment(Guid commentId)
        {
            try
            {
                _repoWrapper.Comment.Delete(_repoWrapper.Comment.GetById(commentId));
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllProducts action: {ex.Message}");
                ErrorApiModel eam = new ErrorApiModel();
                eam.Message = $"Something went wrong inside GetAllProducts action: {ex.Message}";
                eam.StatusCode = "500";
                return StatusCode(500, eam);
            }
        }

        #endregion

    }
}
