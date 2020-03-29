using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface IBrandRepository : IRepositoryBase<Brands>
    {
        IEnumerable<Brands> GetAllBrandts();
    }
}
