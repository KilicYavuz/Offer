using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Contracts
{
    public interface IRepositoryBase<T>
    {
        IQueryable<T> FindAll();
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, params Expression<Func<T, object>>[] includes);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        T GetById(Guid id);
        void TryUpdateManyToMany(IEnumerable<T> deleteItems, IEnumerable<T> newItems);
    }
}
