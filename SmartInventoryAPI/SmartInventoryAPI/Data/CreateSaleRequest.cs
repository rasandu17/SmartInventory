namespace SmartInventoryAPI.Data
{
    public class CreateSaleRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int SoldBy { get; set; }
    }

}
