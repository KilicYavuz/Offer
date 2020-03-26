namespace Contracts
{
    public interface IRepositoryWrapper
    {
        IUserRepository User { get; }
        IAddressRepository Address { get; }
        void Save();
    }
}
