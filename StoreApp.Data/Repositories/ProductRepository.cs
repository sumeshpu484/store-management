using Microsoft.EntityFrameworkCore;
using StoreApp.Core.Exceptions;
using StoreApp.Data.Models;

namespace StoreApp.Data.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<Product> GetByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            throw new NotFoundException($"Product with ID {id} not found");
        }
        return product;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;
        
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        var existingProduct = await GetByIdAsync(product.ProductId);
        
        existingProduct.Name = product.Name;
        existingProduct.Description = product.Description;
        existingProduct.CategoryId = product.CategoryId;
        existingProduct.UnitPrice = product.UnitPrice;
        existingProduct.Barcode = product.Barcode;
        existingProduct.ImageUrl = product.ImageUrl;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        _context.Products.Update(existingProduct);
        await _context.SaveChangesAsync();
        return existingProduct;
    }

    public async Task DeleteAsync(int id)
    {
        var product = await GetByIdAsync(id);
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }
}