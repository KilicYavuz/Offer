﻿using Entities.Models;
using System;
using System.Collections.Generic;

namespace Contracts
{
    public interface IProductRepository : IRepositoryBase<Products>
    {
        IEnumerable<Products> GetAll();
        Products GetById(Guid id);
    }
}
