using backend.Models;

public interface ICustomerService
{
    Task<IEnumerable<Customer>> GetAllAsync();
    Task CreateAsync(Customer customer);
}
