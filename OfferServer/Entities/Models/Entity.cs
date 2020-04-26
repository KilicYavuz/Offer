using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    public abstract class Entity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]        
        [BindNever] 
        public Guid Oid { get; set; }

        private DateTime? createdDate;
        
        [DataType(DataType.DateTime)]
        [BindNever]
        public DateTime CreatedDate
        {
            get { return createdDate ?? DateTime.Now; }
            set { createdDate = value; }
        }

        [BindNever]
        public DateTime? UpdatedDate { get; set; }
    }
}