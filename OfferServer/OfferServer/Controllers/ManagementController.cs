using Contracts;
using Entities;
using LoggerService;
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
                var products = _repoWrapper.Product.FindByCondition(x => x.CreatedDate > new DateTime(2020, 4, 13), i => i.Brand, i => i.Category, i => i.ProductTags).OrderBy(u => u.CategoryOid).ToList();

                var json = JsonConvert.SerializeObject(products);
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

        [HttpGet("getProduct/{id}")]
        public IActionResult GetProduct(Guid id)
        {
            try
            {
                var product = _repoWrapper.Product.FindByCondition(x => x.Oid == id, i => i.Brand, i => i.Category, i => i.ProductOptions, i => i.ProductTags).FirstOrDefault();

                if (product == null)
                {
                    return NotFound();
                }

                product.SelectedTags = product.ProductTags.Select(x => x.TagOid).ToList();
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
                var data = JsonConvert.DeserializeObject<Product>(postData.ToString());

                var found = _repoWrapper.Product.FindByCondition(x => x.CategoryOid == data.CategoryOid && x.Name == data.Name);
                if (found.Any())
                {
                    ErrorApiModel eam = new ErrorApiModel() { Message = $"Item already exsist" };
                    return BadRequest(eam);
                }

                if (data.SelectedTags != null)
                {
                    foreach (var tagId in data.SelectedTags)
                    {
                        data.ProductTags.Add(new ProductTag() { Oid = Guid.NewGuid(), TagOid = tagId, ProductOid = data.Oid, CreatedDate = DateTime.Now });
                    }
                }

                _repoWrapper.Product.Add(data);
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

        [HttpPost("updateProduct")]
        public IActionResult UpdateProduct([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }

                var data = JsonConvert.DeserializeObject<Product>(postData.ToString());

                //var product = _repoWrapper.Product.GetById(data.Oid);
                if (data == null)
                {
                    return NotFound();
                }

                if (data.SelectedTags != null)
                {
                    var tags = _repoWrapper.ProductTag.FindByCondition(x => x.ProductOid == data.Oid).ToList();
                    var deleteTags = tags.Where(x => !data.SelectedTags.Contains(x.TagOid)).ToList();
                    var addTags = data.SelectedTags.Where(x => !tags.Select(t => t.TagOid).Contains(x))?.Select(a => new ProductTag { TagOid = a, ProductOid = data.Oid }).ToList();
                    foreach (var addTag in addTags)
                    {
                        _repoWrapper.ProductTag.Add(addTag);
                    }
                    foreach (var tag in deleteTags)
                    {
                        _repoWrapper.ProductTag.Delete(tag);
                    }
                    // _repoWrapper.ProductTag.TryUpdateManyToMany(deleteTags, addTags);
                    // _repoWrapper.Save();
                }

                _repoWrapper.Product.Update(data);
                _repoWrapper.Save();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("deleteProduct/{id}/{permanent}")]
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

                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Brand

        [HttpGet("getAllBrands")]
        public IActionResult GetAllBrands()
        {
            try
            {
                var brands = _repoWrapper.Brand.FindAll().OrderBy(u => u.Name).ToList();

                _logger.LogInfo($"Returned all Brands from database.");
                var json = JsonConvert.SerializeObject(brands);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllBrands action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getBrand/{id}")]
        public IActionResult GetBrand(Guid id)
        {
            try
            {
                var data = _repoWrapper.Brand.GetById(id);

                var json = JsonConvert.SerializeObject(data);

                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("addBrand")]
        public IActionResult AddBrand([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<Brand>(postData.ToString());

                var found = _repoWrapper.Brand.FindByCondition(x => x.Name == data.Name);
                if (found.Any())
                {
                    ErrorApiModel eam = new ErrorApiModel() { Message = $"Item already exsist" };
                    return BadRequest(eam);
                }

                _repoWrapper.Brand.Add(data);
                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddBrand action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("updateBrand")]
        public IActionResult UpdateBrand([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }

                var data = JsonConvert.DeserializeObject<Brand>(postData.ToString());

                var brand = _repoWrapper.Brand.GetById(data.Oid);
                if (brand == null)
                {
                    return NotFound();
                }

                data.UpdatedDate = DateTime.Now;
                _repoWrapper.Brand.Update(data);
                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateBrand action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("deleteBrand/{id}/{permanent}")]
        public IActionResult DeleteBrand(Guid id, bool permanent)
        {
            try
            {
                var data = _repoWrapper.Brand.GetById(id);
                if (data == null)
                {
                    return NotFound();
                }

                if (permanent)
                {
                    _repoWrapper.Brand.Delete(data);
                }
                else
                {
                    data.State = ItemState.Deleted;
                    data.UpdatedDate = DateTime.Now;
                    _repoWrapper.Brand.Update(data);
                }

                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteBrand action: {ex.Message}");
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
                var categories = _repoWrapper.Category.FindAll().OrderBy(u => u.ParentOid).ToList();//.FindByCondition(x => x.ParentOid == null, i => i.ParentCategory, i => i.SubCategories).OrderBy(u => u.ParentOid).ToList();

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
        public IActionResult GetCategory(Guid id)
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
                var data = JsonConvert.DeserializeObject<Category>(postData.ToString());

                var found = _repoWrapper.Category.FindByCondition(x => x.ParentOid == data.ParentOid && x.Name == data.Name);
                if (found.Any())
                {
                    ErrorApiModel eam = new ErrorApiModel() { Message = $"Item already exsist" };
                    return BadRequest(eam);
                }
                data.CreatedDate = DateTime.Now;
                _repoWrapper.Category.Add(data);
                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("updateCategory")]
        public IActionResult UpdateCategory([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }

                var data = JsonConvert.DeserializeObject<Category>(postData.ToString());

                var category = _repoWrapper.Category.GetById(data.Oid);
                if (category == null)
                {
                    return NotFound();
                }

                data.UpdatedDate = DateTime.Now;
                _repoWrapper.Category.Update(data);
                _repoWrapper.Save();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("deleteCategory/{id}/{permanent}")]
        public IActionResult DeleteCategory(Guid id, bool permanent)
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

                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteCategory action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region Tag

        [HttpGet("getAllTags")]
        public IActionResult GetAllTags()
        {
            try
            {
                var productTags = _repoWrapper.Tag.FindAll().OrderBy(t => t.Name).ToList();

                var json = JsonConvert.SerializeObject(productTags);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetAllTags action: {ex.Message}");
                ErrorApiModel eam = new ErrorApiModel();
                eam.Message = $"Something went wrong inside GetAllTags action: {ex.Message}";
                eam.StatusCode = "500";
                return StatusCode(500, eam);
            }
        }

        [HttpGet("getTag/{id}")]
        public IActionResult GetTag(Guid id)
        {
            try
            {
                var tag = _repoWrapper.Tag.GetById(id);

                if (tag == null)
                {
                    return NotFound();
                }

                var json = JsonConvert.SerializeObject(tag);
                return Ok(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside GetTag action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("addTag")]
        public IActionResult AddTag([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }
                var data = JsonConvert.DeserializeObject<Tag>(postData.ToString());

                var found = _repoWrapper.Tag.FindByCondition(x => x.Name == data.Name);
                if (found.Any())
                {
                    ErrorApiModel eam = new ErrorApiModel() { Message = $"Item already exsist" };
                    return BadRequest(eam);
                }

                data.CreatedDate = DateTime.Now;
                _repoWrapper.Tag.Add(data);
                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside AddTag action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("updateTag")]
        public IActionResult UpdateTag([FromBody]object postData)
        {
            try
            {
                if (postData == null)
                {
                    return BadRequest();
                }

                var data = JsonConvert.DeserializeObject<Tag>(postData.ToString());

                var tag = _repoWrapper.Tag.GetById(data.Oid);
                if (tag == null)
                {
                    return NotFound();
                }

                _repoWrapper.Tag.Update(data);
                _repoWrapper.Save();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside UpdateTag action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("deleteTag/{id}/{permanent}")]
        public IActionResult DeleteTag(Guid id, bool permanent)
        {
            try
            {
                var data = _repoWrapper.Tag.GetById(id);
                if (data == null)
                {
                    return NotFound();
                }

                if (permanent)
                {
                    _repoWrapper.Tag.Delete(data);
                }
                else
                {
                    ///TODO:Açılacak sonra
                    //data.State = ItemState.Deleted;
                    //data.UpdatedDate = DateTime.Now;
                    _repoWrapper.Tag.Update(data);
                }

                _repoWrapper.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong inside DeleteTag action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #endregion

        #region ProductTag

        [HttpGet("getAllProductTags")]
        public IActionResult GetAllProductTags()
        {
            try
            {
                var productTags = _repoWrapper.ProductTag.FindAll().OrderBy(t => t.ProductOid).ToList();

                var json = JsonConvert.SerializeObject(productTags);
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

        //[HttpGet("getProduct/{id}")]
        //public IActionResult GetProductTag(Guid id)
        //{
        //    try
        //    {
        //        var product = _repoWrapper.ProductTag.(id);

        //        if (product == null)
        //        {
        //            return NotFound();
        //        }

        //        var json = JsonConvert.SerializeObject(product);
        //        return Ok(json);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Something went wrong inside GetProduct action: {ex.Message}");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}

        //[HttpPost("addProduct")]
        //public IActionResult AddProduct([FromBody]object postData)
        //{
        //    try
        //    {
        //        if (postData == null)
        //        {
        //            return BadRequest();
        //        }
        //        var data = JsonConvert.DeserializeObject<Products>(postData.ToString());

        //        var found = _repoWrapper.Product.FindByCondition(x => x.CategoryOid == data.CategoryOid && x.Name == data.Name);
        //        if (found.Any())
        //        {
        //            ErrorApiModel eam = new ErrorApiModel() { Message = $"Item already exsist" };
        //            return BadRequest(eam);
        //        }

        //        _repoWrapper.Product.Add(data);
        //        _repoWrapper.Save();
        //        return NoContent();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Something went wrong inside AddProduct action: {ex.Message}");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}

        //[HttpPost("updateProduct/{id}")]
        //public IActionResult UpdateProduct(Guid id, [FromBody]object postData)
        //{
        //    try
        //    {
        //        if (postData == null)
        //        {
        //            return BadRequest();
        //        }

        //        var data = JsonConvert.DeserializeObject<Products>(postData.ToString());

        //        var product = _repoWrapper.Product.GetById(id);
        //        if (product == null)
        //        {
        //            return NotFound();
        //        }

        //        data.Oid = id;
        //        _repoWrapper.Product.Update(data);
        //        _repoWrapper.Save();

        //        return NoContent();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Something went wrong inside UpdateProduct action: {ex.Message}");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}

        //[HttpGet("deleteProduct/{id}/{permanent}")]
        //public IActionResult DeleteProduct(Guid id, bool permanent)
        //{
        //    try
        //    {
        //        var data = _repoWrapper.Product.GetById(id);
        //        if (data == null)
        //        {
        //            return NotFound();
        //        }

        //        if (permanent)
        //        {
        //            _repoWrapper.Product.Delete(data);
        //        }
        //        else
        //        {
        //            data.State = ItemState.Deleted;
        //            data.UpdatedDate = DateTime.Now;
        //            _repoWrapper.Product.Update(data);
        //        }

        //        _repoWrapper.Save();
        //        return NoContent();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError($"Something went wrong inside DeleteProduct action: {ex.Message}");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}

        #endregion
    }
}
