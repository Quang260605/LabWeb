using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [StringLength(150, ErrorMessage = "Tiêu đề không quá 150 ký tự")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Tác giả không được để trống")]
        [StringLength(150, ErrorMessage = "Tác giả không quá 150 ký tự")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Giá không được để trống")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
        public decimal Price { get; set; }

        public string? Description { get; set; }

        [StringLength(100)]
        public string? Image { get; set; }

        [Required(ErrorMessage = "Chủ đề không được để trống")]
        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        public Category? Category { get; set; }
    }
}