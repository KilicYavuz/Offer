using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class FavoriteListRepository : RepositoryBase<FavoriteList>, IFavoriteListRepository
    {
        public FavoriteListRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

    }
}
