using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    [Table("Users")]
    public class User : Entity<int>
    {
        [StringLength(50, ErrorMessage = "Name can't be longer than 50 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Name is required")] 
        public string Email { get; set; }
        
        public string Password { get; set; }

        [Required(ErrorMessage = "Birth date is required")]
        public DateTime BirthDate { get; set; }

        public ICollection<Address> Addresses { get; set; }
    }
}