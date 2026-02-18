using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

// ================== 模拟数据库 ==================
var customers = new List<Customer>();
var products = new List<Product>();
var orders = new List<Order>();

// ================== Customer ==================

app.MapGet("/customers", () => customers);

app.MapPost("/customers", (Customer customer) =>
{
    customer.Id = Guid.NewGuid();
    customer.CreatedAt = DateTime.UtcNow;
    customers.Add(customer);
    return Results.Created($"/customers/{customer.Id}", customer);
});

app.MapDelete("/customers/{id}", (Guid id) =>
{
    var customer = customers.FirstOrDefault(c => c.Id == id);
    if (customer == null)
        return Results.NotFound();
    customers.Remove(customer);
    return Results.NoContent();
});

// ================== Product ==================

app.MapGet("/products", () => products);

app.MapPost("/products", (Product product) =>
{
    product.Id = Guid.NewGuid();
    products.Add(product);
    return Results.Created($"/products/{product.Id}", product);
});

app.MapPut("/products/{id}", (Guid id, UpdateProductRequest request) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product == null)
        return Results.NotFound();
    if (request.Name != null)
        product.Name = request.Name;
    if (request.Price.HasValue)
        product.Price = request.Price.Value;
    if (request.Stock.HasValue)
        product.Stock = request.Stock.Value;
    return Results.Ok(product);
});

app.MapDelete("/products/{id}", (Guid id) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product == null)
        return Results.NotFound();
    products.Remove(product);
    return Results.NoContent();
});

// ================== Order ==================

app.MapGet("/orders", () =>
{
    var orderResponses = orders.Select(o =>
    {
        var customer = customers.FirstOrDefault(c => c.Id == o.CustomerId);
        var product = products.FirstOrDefault(p => p.Id == o.ProductId);
        return new
        {
            o.Id,
            CustomerName = customer?.Name ?? "Unknown",
            ProductName = product?.Name ?? "Unknown",
            o.Quantity,
            o.TotalPrice,
            o.CreatedAt
        };
    }).ToList();
    return Results.Ok(orderResponses);
});

app.MapPost("/orders", (CreateOrderRequest request) =>
{
    var customer = customers.FirstOrDefault(c => c.Id == request.CustomerId);
    var product = products.FirstOrDefault(p => p.Id == request.ProductId);

    if (customer == null)
        return Results.BadRequest("Customer not found");
    if (product == null)
        return Results.BadRequest("Product not found");
    if (product.Stock < request.Quantity)
        return Results.BadRequest("Insufficient stock");

    product.Stock -= request.Quantity;

    var order = new Order
    {
        Id = Guid.NewGuid(),
        CustomerId = request.CustomerId,
        ProductId = request.ProductId,
        Quantity = request.Quantity,
        TotalPrice = request.Quantity * product.Price,
        CreatedAt = DateTime.UtcNow
    };

    orders.Add(order);
    return Results.Created($"/orders/{order.Id}", order);
});

app.MapDelete("/orders/{id}", (Guid id) =>
{
    var order = orders.FirstOrDefault(o => o.Id == id);
    if (order == null)
        return Results.NotFound();
    
    var product = products.FirstOrDefault(p => p.Id == order.ProductId);
    if (product != null)
        product.Stock += order.Quantity;
    
    orders.Remove(order);
    return Results.NoContent();
});

app.Run();

record CreateOrderRequest(Guid CustomerId, Guid ProductId, int Quantity);
record UpdateProductRequest(string? Name, decimal? Price, int? Stock);
