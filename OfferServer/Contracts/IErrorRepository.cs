using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface IErrorRepository : IRepositoryBase<ErrorLog>
    {
        IEnumerable<ErrorLog> GetAllErrors();
    }
}
