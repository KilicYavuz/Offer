using Entities.Models;

namespace Contracts
{
    public interface ITagRepository : IRepositoryBase<Tags>
    {
        Tags GetById(int id);
    }
}
