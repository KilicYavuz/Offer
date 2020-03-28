using Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Repository
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        protected OfferContext OfferContext { get; set; }

        public RepositoryBase(OfferContext offerContext)
        {
            this.OfferContext = offerContext;
        }

        public IQueryable<T> FindAll()
        {
            return this.OfferContext.Set<T>().AsNoTracking();
        }

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return this.OfferContext.Set<T>().Where(expression).AsNoTracking();
        }

        public void Create(T entity)
        {
            this.OfferContext.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            this.OfferContext.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            this.OfferContext.Set<T>().Remove(entity);
        }
    }
}
