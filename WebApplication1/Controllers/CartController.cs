using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Helpers;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var cart = HttpContext.Session.Get<List<CartItem>>("Cart") ?? new List<CartItem>();
            return View(cart);
        }

        public async Task<IActionResult> AddToCart(int id, int quantity = 1)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            var cart = HttpContext.Session.Get<List<CartItem>>("Cart") ?? new List<CartItem>();
            var cartItem = cart.FirstOrDefault(c => c.Book.BookId == id);

            if (cartItem == null)
            {
                cart.Add(new CartItem { Book = book, Quantity = quantity });
            }
            else
            {
                cartItem.Quantity += quantity;
            }

            HttpContext.Session.Set("Cart", cart);
            return RedirectToAction("Index");
        }

        public IActionResult RemoveFromCart(int id)
        {
            var cart = HttpContext.Session.Get<List<CartItem>>("Cart");
            if (cart != null)
            {
                var cartItem = cart.FirstOrDefault(c => c.Book.BookId == id);
                if (cartItem != null)
                {
                    cart.Remove(cartItem);
                    HttpContext.Session.Set("Cart", cart);
                }
            }
            return RedirectToAction("Index");
        }
    }
}
