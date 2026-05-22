using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Tên chủ đề không được để trống")]
        [StringLength(100, ErrorMessage = "Tên chủ đề không quá 100 ký tự")]
        public string CategoryName { get; set; }

        public List<Book>? Books { get; set; }
    }
}