using StoreApp.Data.Repositories;
using StoreApp.Data.Models;
using StoreApp.Core.Exceptions;

namespace StoreApp.Services.Persons;

public class PersonService : IPersonService
{
    private readonly IPersonRepository _repository;

    public PersonService(IPersonRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Person> GetByIdAsync(int id)
    {
        var person = await _repository.GetByIdAsync(id);
        if (person == null)
            throw new NotFoundException($"Person with ID {id} was not found");
        return person;
    }

    public async Task<Person> CreateAsync(Person person)
    {
        ValidatePerson(person);
        return await _repository.AddAsync(person);
    }

    public async Task<Person> UpdateAsync(int id, Person person)
    {
        if (id != person.Id)
            throw new ApiException("ID mismatch between URL and request body");

        ValidatePerson(person);
        
        var updatedPerson = await _repository.UpdateAsync(person);
        if (updatedPerson == null)
            throw new NotFoundException($"Person with ID {id} was not found");
            
        return updatedPerson;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var deleted = await _repository.DeleteAsync(id);
        if (!deleted)
            throw new NotFoundException($"Person with ID {id} was not found");
        return true;
    }

    private static void ValidatePerson(Person person)
    {
        if (string.IsNullOrWhiteSpace(person.Name))
            throw new ApiException("Name is required");
        
        if (string.IsNullOrWhiteSpace(person.Email))
            throw new ApiException("Email is required");
    }
}