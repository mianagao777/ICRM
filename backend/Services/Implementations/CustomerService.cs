using backend.Models;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task CreateAsync(Customer customer)
    {
        customer.Id = Guid.NewGuid();
        await _repository.AddAsync(customer);
    }
}
