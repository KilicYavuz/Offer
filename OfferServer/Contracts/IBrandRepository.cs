using Entities.Models;

namespace Contracts
{
    public interface IBrandRepository : IRepositoryBase<Brands>
    {
        Brands GetById(int id);
    }
}
