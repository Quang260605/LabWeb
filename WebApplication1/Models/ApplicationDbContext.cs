using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Cuộc sống" },
                new Category { CategoryId = 2, CategoryName = "Lập trình" },
                new Category { CategoryId = 3, CategoryName = "Sức khỏe" }
            );

            // Seed Books
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    BookId = 1,
                    Title = "Cuộc Sống Rất Giống Cuộc Đời",
                    Author = "Hà Dữ",
                    Price = 81000,
                    Description = "Cuộc sống rất giống cuộc đời...",
                    Image = "cuocsongratgiongcuocdoi.jpg",
                    CategoryId = 1
                },
                new Book
                {
                    BookId = 2,
                    Title = "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
                    Author = "Nguyễn Nhật Ánh",
                    Price = 61600,
                    Description = "Cho tôi xin một vé đi tuổi thơ...",
                    Image = "chotoixinmotvedituoitho.jpg",
                    CategoryId = 1
                },
                new Book
                {
                    BookId = 3,
                    Title = "Java Fundamentals",
                    Author = "Oracle Press",
                    Price = 150000,
                    Description = "Sách học Java cơ bản",
                    Image = "java.jpg",
                    CategoryId = 2
                },
                new Book
                {
                    BookId = 4,
                    Title = "C# in Depth",
                    Author = "Jon Skeet",
                    Price = 120000,
                    Description = "Sách học C# chuyên sâu",
                    Image = "csharp.jpg",
                    CategoryId = 2
                }
            );
        }
    }
}