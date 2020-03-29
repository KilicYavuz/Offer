using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface IProductRepository : IRepositoryBase<Products>
    {
        IEnumerable<Products> GetAllProducts();
    }
}
