using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    public abstract class Entity<T>: IEntity<T>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public T OId { get; set; }
        object IEntity.OId
        {
            get { return OId; }
            set { OId = (T)value; }
        }

        private DateTime? createdDate;
        [DataType(DataType.DateTime)]
        public DateTime CreatedDate
        {
            get { return createdDate ?? DateTime.Now; }
            set { createdDate = value; }
        }
    }
}