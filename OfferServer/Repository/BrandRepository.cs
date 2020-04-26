using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class BrandRepository : RepositoryBase<Brand>, IBrandRepository
    {
        public BrandRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }
    }
}
