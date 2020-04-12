using Contracts;
using Entities.Models;
using System.Linq;

namespace Repository
{
    public class TagRepository : RepositoryBase<Tags>, ITagRepository
    {
        public TagRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

        public Tags GetById(int id)
        {
            var tag = FindByCondition(x => x.Oid == id).FirstOrDefault();
            return tag;
        }
    }
}
