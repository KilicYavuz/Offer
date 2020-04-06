using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface ICategoryRepository : IRepositoryBase<Categories>
    {
        Categories GetById(int id);
    }
}
