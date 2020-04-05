using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface ICategoryRepository : IRepositoryBase<Categories>
    {
        IEnumerable<Categories> GetAll();
        Categories GetById(int id);
    }
}
