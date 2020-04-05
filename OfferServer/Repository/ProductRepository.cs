using Contracts;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class ProductRepository : RepositoryBase<Products>, IProductRepository
    {
        public ProductRepository(OfferContext offerContext)
            : base(offerContext)
        {
        }

        public IEnumerable<Products> GetAll()
        {
            var products = FindAll().OrderBy(u => u.CategoryOid).ToList();
            return products;
        }

        public Products GetById(Guid id)
        {
            var product = FindByCondition(x=>x.Oid == id).OrderBy(u => u.Name).FirstOrDefault();
            return product;
        }

        public bool AddProduct(Products product)
        {
            var isAdded = false;
            try
            {
                Create(product);
                isAdded = true;
            }
            catch (Exception)
            { 
                throw;
            }

            return isAdded;
        }

        public bool UpdateProduct(Products product)
        {
            var isUpdated = false;
            try
            {
                Update(product);
                isUpdated = true;
            }
            catch (Exception)
            { 
                throw;
            }

            return isUpdated;
        }

        public bool DeleteProduct(Products product)
        {
            var isDeleted = false;
            try
            {
                Delete(product);
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
