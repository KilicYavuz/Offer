using Contracts;
using Entities.Models;
using System;
using System.Linq;

namespace Repository
{
    public class ProductRepository : RepositoryBase<Products>, IProductRepository
    {
        public ProductRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

        public Products GetById(Guid id)
        {
            var product = FindByCondition(x=>x.Oid == id).FirstOrDefault();
            return product;
        }

    }
}
