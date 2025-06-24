using StoreApp.Data.Models;

namespace StoreApp.Data.Repositories;

public interface IPersonRepository
{
    Task<IEnumerable<Person>> GetAllAsync();
    Task<Person?> GetByIdAsync(int id);
    Task<Person> AddAsync(Person person);
    Task<Person?> UpdateAsync(Person person);
    Task<bool> DeleteAsync(int id);
}