using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface IUserRepository : IRepositoryBase<Users>
    {
        IEnumerable<Users> GetAllUsers();
    }
}
