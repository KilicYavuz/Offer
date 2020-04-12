namespace Contracts
{
    public interface IRepositoryWrapper
    {
        IUserRepository User { get; }
        IAddressRepository Address { get; }
        ICategoryRepository Category { get; }
        IProductRepository Product { get; }
        IBrandRepository Brand { get; }
        IProductTagRepository ProductTag { get; }
        ITagRepository Tag { get; }

        void Save();
    }
}
