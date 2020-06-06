using Contracts;
using Entities.Models;

namespace Repository
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private OfferContext _repoContext;
        private IUserRepository _user;
        private IAddressRepository _address;
        private ICategoryRepository _category;
        private IProductRepository _product;
        private IOrderProductRepository _orderProduct;
        private ICommentRepository _comment;
        private IFavoriteListRepository _favoriteList;
        private IFavoriteListItemRepository _favoriteListItem;
        private IBrandRepository _brand;
        private IOrderRepository _order;
        private IProductTagRepository _productTag;
        private ITagRepository _tag;

        public IUserRepository User
        {
            get
            {
                if (_user == null)
                {
                    _user = new UserRepository(_repoContext);
                }

                return _user;
            }
        }

        public IAddressRepository Address
        {
            get
            {
                if (_address == null)
                {
                    _address = new AddressRepository(_repoContext);
                }

                return _address;
            }
        }

        public ICommentRepository Comment
        {
            get
            {
                if (_comment == null)
                {
                    _comment = new CommentRepository(_repoContext);
                }

                return _comment;
            }
        }

        public IProductRepository Product
        {
            get
            {
                if (_product == null)
                {
                    _product = new ProductRepository(_repoContext);
                }

                return _product;
            }
        }

        public ICategoryRepository Category
        {
            get
            {
                if (_category == null)
                {
                    _category = new CategoryRepository(_repoContext);
                }

                return _category;
            }
        }

        public IBrandRepository Brand
        {
            get
            {
                if (_brand == null)
                {
                    _brand = new BrandRepository(_repoContext);
                }

                return _brand;
            }
        }

        public IProductTagRepository ProductTag
        {
            get
            {
                if (_productTag == null)
                {
                    _productTag = new ProductTagRepository(_repoContext);
                }

                return _productTag;
            }
        }

        public ITagRepository Tag
        {
            get
            {
                if (_tag == null)
                {
                    _tag = new TagRepository(_repoContext);
                }

                return _tag;
            }
        }

        public IFavoriteListRepository FavoriteList
        {
            get
            {
                if (_favoriteList == null)
                {
                    _favoriteList = new FavoriteListRepository(_repoContext);
                }

                return _favoriteList;
            }
        }

        public IFavoriteListItemRepository FavoriteListItem
        {
            get
            {
                if (_favoriteListItem == null)
                {
                    _favoriteListItem = new FavoriteListItemRepository(_repoContext);
                }

                return _favoriteListItem;
            }
        }

        public IOrderRepository Order
        {
            get
            {
                if (_order == null)
                {
                    _order = new OrderRepository(_repoContext);
                }

                return _order;
            }
        }

        public IOrderProductRepository OrderProduct
        {
            get
            {
                if (_orderProduct == null)
                {
                    _orderProduct = new OrderProductRepository(_repoContext);
                }

                return _orderProduct;
            }
        }

        public RepositoryWrapper(OfferContext repositoryContext)
        {
            _repoContext = repositoryContext;
        }

        public void Save()
        {
            _repoContext.SaveChanges();
        }
    }
}
