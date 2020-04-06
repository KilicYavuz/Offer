using Entities.Models;
using System;
using System.Collections.Generic;

namespace Contracts
{
    public interface IProductRepository : IRepositoryBase<Products>
    {
        Products GetById(Guid id);
    }
}
