using Contracts;
using Entities.Models;
using System;
using System.Linq;

namespace Repository
{
    public class CommentRepository : RepositoryBase<Comment>, ICommentRepository
    {
        public CommentRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }
    }
}
