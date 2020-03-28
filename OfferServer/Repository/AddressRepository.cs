using Contracts;
using Entities.Models;

namespace Repository
{
    public class AddressRepository : RepositoryBase<Address>, IAddressRepository
    {
        public AddressRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }
    }
}
