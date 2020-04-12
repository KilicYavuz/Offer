﻿using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class ProductTagRepository : RepositoryBase<ProductTags>, IProductTagRepository
    {
        public ProductTagRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

        public ProductTags GetById(int id)
        {
            var productTag = FindByCondition(x => x.Oid == id).FirstOrDefault();
            return productTag;
        }
    }
}
