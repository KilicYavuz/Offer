using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    [Table("Address")]
    public class Address : Entity<int>
    {
        [Required(ErrorMessage = "Address Name is required")]
        [StringLength(50, ErrorMessage = "Address Name can't be longer than 50 characters")]
        public string AddressName { get; set; }

        [StringLength(50, ErrorMessage = "Name Surname can't be longer than 250 characters")]
        public string NameSurname { get; set; }

        [ForeignKey(nameof(User))]
        public int UserOId { get; set; }

        public User User { get; set; }
    }
}
