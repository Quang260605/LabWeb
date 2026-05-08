using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using web.Models;

namespace web.Controllers
{
    public class BaiTap2Controller : Controller
    {
        // GET: BaiTap2
        public IActionResult BaiTap2()
        {
            var sanPham = new SanPhamViewModel1()
            {
                TenSanPham = "Laptop Dell XPS 13",
                GiaBan = 25000000,
                AnhMoTa = "laptop_dell_xps13.jpg"
            };
            return View(sanPham);
        }
    }
}
