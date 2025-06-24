using Microsoft.EntityFrameworkCore;
using StoreApp.Data.Models;

namespace StoreApp.Data.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly ApplicationDbContext _context;

    public PersonRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Person>> GetAllAsync()
    {
        return await _context.People.ToListAsync();
    }

    public async Task<Person?> GetByIdAsync(int id)
    {
        return await _context.People.FindAsync(id);
    }

    public async Task<Person> AddAsync(Person person)
    {
        _context.People.Add(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<Person?> UpdateAsync(Person person)
    {
        var existingPerson = await _context.People.FindAsync(person.Id);
        if (existingPerson == null)
            return null;

        existingPerson.Name = person.Name;
        existingPerson.Email = person.Email;
        await _context.SaveChangesAsync();
        return existingPerson;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null)
            return false;

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
        return true;
    }
}