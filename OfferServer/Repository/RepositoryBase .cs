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
        protected readonly ILoggerManager Logger;

        protected OfferContext OfferContext { get; set; }

        protected RepositoryBase(OfferContext offerContext)
        {
            this.OfferContext = offerContext;
        }

        public IQueryable<T> FindAll()
        {
            return this.OfferContext.Set<T>().AsNoTracking();
        }

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includes)
        {
            return includes.Aggregate(this.OfferContext.Set<T>().Where(expression), (current, includeProperty)=> current.Include(includeProperty));
        }  
        
        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return this.OfferContext.Set<T>().Where(expression).AsNoTracking();
        }

        public void Add(T entity)
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

        //public T GetById(object id)
        //{
        //    var product = FindByCondition(x => x.Oid == id).OrderBy(u => u.Name).FirstOrDefault();
        //    return product;
        //}
    }
}
