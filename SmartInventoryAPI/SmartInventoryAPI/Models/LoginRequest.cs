using Microsoft.AspNetCore.Mvc;

namespace SmartInventoryAPI.Models
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

}
