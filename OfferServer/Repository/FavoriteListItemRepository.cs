using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class FavoriteListItemRepository : RepositoryBase<FavoriteListItem>, IFavoriteListItemRepository
    {
        public FavoriteListItemRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

    }
}
