namespace SmartInventoryAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } // hashed later
        public string Role { get; set; } // "owner" or "staff"
    }
}
