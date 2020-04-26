using Contracts;
using Entities.Models;
using System.Linq;

namespace Repository
{
    public class TagRepository : RepositoryBase<Tag>, ITagRepository
    {
        public TagRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

    }
}
