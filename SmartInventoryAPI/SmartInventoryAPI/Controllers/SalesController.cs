using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartInventoryAPI.Data;
using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SalesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sale>>> GetSales()
        {
            return await _context.Sales.Include(s => s.ProductId).ToListAsync();
        }

        // POST: api/sales
        [HttpPost]
        public async Task<ActionResult<Sale>> CreateSale([FromBody] Sale sale)
        {
            // Check if product exists
            var product = await _context.Products.FindAsync(sale.ProductId);
            if (product == null) return NotFound("Product not found");

            // Check stock
            if (product.Stock < sale.Quantity)
                return BadRequest("Insufficient stock");

            // Update stock
            product.Stock -= sale.Quantity;

            // Calculate total price
            sale.TotalPrice = sale.Quantity * product.Price;
            sale.SaleDate = DateTime.Now;

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSales), new { id = sale.Id }, sale);
        }
        [HttpGet("dashboard")]
        [Authorize(Roles = "owner")]
        public async Task<IActionResult> GetDashboard()
        {
            // Total sales today
            var today = DateTime.Today;
            var dailySales = await _context.Sales
                .Where(s => s.SaleDate >= today)
                .SumAsync(s => s.TotalPrice);

            // Total sales this week
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var weeklySales = await _context.Sales
                .Where(s => s.SaleDate >= startOfWeek)
                .SumAsync(s => s.TotalPrice);

            // Total sales this month
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var monthlySales = await _context.Sales
                .Where(s => s.SaleDate >= startOfMonth)
                .SumAsync(s => s.TotalPrice);

            // Low-stock products (stock <= 5)
            var lowStock = await _context.Products
                .Where(p => p.Stock <= 5)
                .Select(p => new { p.Id, p.Name, p.Stock })
                .ToListAsync();

            return Ok(new
            {
                dailySales,
                weeklySales,
                monthlySales,
                lowStock
            });
        }
    }
}
