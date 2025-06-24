using StoreApp.Data.Models;

namespace StoreApp.Services.Persons;

public interface IPersonService
{
    Task<IEnumerable<Person>> GetAllAsync();
    Task<Person> GetByIdAsync(int id);
    Task<Person> CreateAsync(Person person);
    Task<Person> UpdateAsync(int id, Person person);
    Task<bool> DeleteAsync(int id);
}