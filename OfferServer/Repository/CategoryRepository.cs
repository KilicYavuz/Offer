using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class CategoryRepository : RepositoryBase<Categories>, ICategoryRepository
    {
        public CategoryRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }
    }
}
