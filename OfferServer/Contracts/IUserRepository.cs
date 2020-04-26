using Entities.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        //IEnumerable<Users> GetAllUsers();
    }
}
