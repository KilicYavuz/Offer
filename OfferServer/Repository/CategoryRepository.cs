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


        public IEnumerable<Categories> GetAll()
        {
            var categories = FindAll().OrderBy(u => u.ParentOid).ToList();
            return categories;
        }

        public Categories GetById(int id)
        {
            var category = FindByCondition(x => x.Oid == id).OrderBy(u => u.Name).FirstOrDefault();
            return category;
        }

        public bool AddCategory(Categories category)
        {
            var isAdded = false;
            try
            {
                Create(category);
                isAdded = true;
            }
            catch (Exception)
            {
                throw;
            }

            return isAdded;
        }

        public bool UpdateCategory(Categories category)
        {
            var isUpdated = false;
            try
            {
                Update(category);
                isUpdated = true;
            }
            catch (Exception)
            {
                throw;
            }

            return isUpdated;
        }

        public bool DeleteCategory(Categories category)
        {
            var isDeleted = false;
            try
            {
                Delete(category);
                isDeleted = true;
            }
            catch (Exception)
            {
                throw;
            }

            return isDeleted;
        }
    }
}
