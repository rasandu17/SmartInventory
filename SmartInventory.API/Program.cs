using Microsoft.EntityFrameworkCore;
using SmartInventory.API.Data;

var builder = WebApplication.CreateBuilder(args);

// MySQL Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 36)))); // use your MySQL version

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();
