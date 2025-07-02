using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using StoreApp.Model.Product;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly string _connectionString;

    public ProductRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException("DefaultConnection string is missing in configuration");
    }

    public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            INSERT INTO products (
                name,
                description,
                units,
                minimum_stock,
                maximum_stock,
                current_stock,
                category_id,
                is_active,
                created_at
            )
            VALUES (
                @Name,
                @Description,
                @Units,
                @MinimumStock,
                @MaximumStock,
                @CurrentStock,
                @CategoryId,
                true,
                CURRENT_TIMESTAMP
            )
            RETURNING 
                product_id as ProductId,
                name as Name,
                description as Description,
                units as Units,
                minimum_stock as MinimumStock,
                maximum_stock as MaximumStock,
                current_stock as CurrentStock,
                category_id as CategoryId,
                is_active as IsActive,
                created_at as CreatedAt;";

        var product = await connection.QuerySingleAsync<ProductResponse>(sql, request);
        return product;
    }

    public async Task<ProductResponse?> GetProductByIdAsync(int productId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            SELECT 
                p.product_id as ProductId,
                p.name as Name,
                p.description as Description,
                p.units as Units,
                p.minimum_stock as MinimumStock,
                p.maximum_stock as MaximumStock,
                p.current_stock as CurrentStock,
                p.category_id as CategoryId,
                p.is_active as IsActive,
                p.created_at as CreatedAt
            FROM products p
            WHERE p.product_id = @ProductId;";

        return await connection.QuerySingleOrDefaultAsync<ProductResponse>(sql, new { ProductId = productId });
    }

    public async Task<IEnumerable<ProductListItem>> GetAllProductsAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            SELECT 
                p.product_id as ProductId,
                p.name as Name,
                p.units as Units,
                p.current_stock as CurrentStock,
                p.category_id as CategoryId,
                p.is_active as IsActive
            FROM products p
            ORDER BY p.product_id;";

        return await connection.QueryAsync<ProductListItem>(sql);
    }

    public async Task<IEnumerable<ProductListItem>> GetProductsByStoreIdAsync(int storeId)
    {
        // This method is now obsolete as there is no store_id in the new model.
        // Returning all products for compatibility, but you may want to remove this method.
        return await GetAllProductsAsync();
    }

    public async Task<ProductResponse> UpdateProductAsync(UpdateProductRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            UPDATE products 
            SET 
                name = @Name,
                description = @Description,
                units = @Units,
                minimum_stock = @MinimumStock,
                maximum_stock = @MaximumStock,
                currentstock = @CurrentStock,
                category_id = @CategoryId,
                is_active = @IsActive
            WHERE product_id = @ProductId
            RETURNING 
                product_id as ProductId,
                name as Name,
                description as Description,
                units as Units,
                minimum_stock as MinimumStock,
                maximum_stock as MaximumStock,
                current_stock as CurrentStock,
                category_id as CategoryId,
                is_active as IsActive,
                created_at as CreatedAt;";

        return await connection.QuerySingleAsync<ProductResponse>(sql, request);
    }

    public async Task<bool> DeleteProductAsync(int productId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = "DELETE FROM products WHERE product_id = @ProductId;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { ProductId = productId });
        return rowsAffected > 0;
    }

    public async Task<bool> DeactivateProductAsync(int productId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = "UPDATE products SET is_active = false WHERE product_id = @ProductId;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { ProductId = productId });
        return rowsAffected > 0;
    }

    public async Task<bool> ActivateProductAsync(int productId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = "UPDATE products SET is_active = true WHERE product_id = @ProductId;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { ProductId = productId });
        return rowsAffected > 0;
    }

    // Category CRUD
    public async Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"
            INSERT INTO categories (name, description, code, is_active, createdon)
            VALUES (@Name, @Description, @Code, true, CURRENT_TIMESTAMP)
            RETURNING category_id as CategoryId, name, description, code, is_active as IsActive, createdon as CreatedOn, updatedon as UpdatedOn;";
        return await connection.QuerySingleAsync<CategoryResponse>(sql, request);
    }

    public async Task<CategoryResponse?> GetCategoryByIdAsync(int categoryId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"
            SELECT category_id as CategoryId, name, description, code, is_active as IsActive, createdon as CreatedOn, updatedon as UpdatedOn
            FROM categories WHERE category_id = @CategoryId;";
        return await connection.QuerySingleOrDefaultAsync<CategoryResponse>(sql, new { CategoryId = categoryId });
    }

    public async Task<IEnumerable<CategoryListItem>> GetAllCategoriesAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"SELECT category_id as CategoryId, name, code, is_active as IsActive FROM categories ORDER BY category_id;";
        return await connection.QueryAsync<CategoryListItem>(sql);
    }

    public async Task<CategoryResponse> UpdateCategoryAsync(UpdateCategoryRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"UPDATE categories SET name = @Name, description = @Description, code = @Code, is_active = @IsActive, updatedon = CURRENT_TIMESTAMP WHERE category_id = @CategoryId RETURNING category_id as CategoryId, name, description, code, is_active as IsActive, createdon as CreatedOn, updatedon as UpdatedOn;";
        return await connection.QuerySingleAsync<CategoryResponse>(sql, request);
    }

    public async Task<bool> DeleteCategoryAsync(int categoryId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = "DELETE FROM categories WHERE category_id = @CategoryId;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { CategoryId = categoryId });
        return rowsAffected > 0;
    }

    public async Task<bool> DeactivateCategoryAsync(int categoryId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = "UPDATE categories SET is_active = false, updatedon = CURRENT_TIMESTAMP WHERE category_id = @CategoryId;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { CategoryId = categoryId });
        return rowsAffected > 0;
    }

    public async Task<bool> ActivateCategoryAsync(int categoryId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = "UPDATE categories SET is_active = true, updatedon = CURRENT_TIMESTAMP WHERE category_id = @CategoryId;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { CategoryId = categoryId });
        return rowsAffected > 0;
    }
}