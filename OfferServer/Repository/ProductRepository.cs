using Contracts;
using Entities.Models;
using System;
using System.Linq;

namespace Repository
{
    public class ProductRepository : RepositoryBase<Product>, IProductRepository
    {
        public ProductRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }
    }
}
