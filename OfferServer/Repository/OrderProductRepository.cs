using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class OrderProductRepository : RepositoryBase<OrderProduct>, IOrderProductRepository
    {
        public OrderProductRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

    }
}
