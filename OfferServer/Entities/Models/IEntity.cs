using System;

namespace Entities.Models
{
    public interface IEntity
    {
        object OId { get; set; }
        DateTime CreatedDate { get; set; }
    }
    
    public interface IEntity<T> : IEntity
    {
        new T OId { get; set; }
    }
}
