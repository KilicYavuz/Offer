using Contracts;
using LoggerService;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using Entities;

namespace Repository
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : Entity
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
            return includes.Aggregate(this.OfferContext.Set<T>().Where(expression), (current, includeProperty)=> current.Include(includeProperty)).OrderByDescending(x=>x.CreatedDate);
        }  
        
        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return this.OfferContext.Set<T>().Where(expression).AsNoTracking().OrderByDescending(x => x.CreatedDate);
        }

        public void Add(T entity)
        {
            this.OfferContext.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            entity.ModifiedDate = DateTime.Now;
            //this.OfferContext.Attach<T>(entity);
            //this.OfferContext.Entry<T>(entity).Property("Oid").IsModified= true;
            //this.OfferContext.Entry<T>(entity).State = EntityState.Modified;
            this.OfferContext.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            this.OfferContext.Set<T>().Remove(entity);
        }

        public T GetById(Guid id)
        {
            var product = FindByCondition(x => x.Oid == id).FirstOrDefault();
            return product;
        }

        public void TryUpdateManyToMany(IEnumerable<T> deleteItems, IEnumerable<T> newItems)
        {
            if (deleteItems.Any())
            {
                this.OfferContext.Set<T>().RemoveRange(deleteItems);
            }
            if (newItems.Any())
            {
                this.OfferContext.Set<T>().AddRange(newItems);
            }
        }
    }
}
