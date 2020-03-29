using Contracts;
using Entities.Models;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class UserRepository : RepositoryBase<Users>, IUserRepository
    {
        public UserRepository(OfferContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public IEnumerable<Users> GetAllUsers()
        {
            var users = FindAll().OrderBy(u => u.Name).ToList();
            return users;
        }
    }
}
