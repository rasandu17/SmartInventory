namespace SmartInventory.API.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }

        public ICollection<SaleItem> Items { get; set; }
    }
}
