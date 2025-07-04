using StoreApp.Model.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public interface IProductRepository
{
    Task<ProductResponse> CreateProductAsync(CreateProductRequest request);
    Task<ProductResponse?> GetProductByIdAsync(int productId);
    Task<IEnumerable<ProductListItem>> GetAllProductsAsync();
    Task<IEnumerable<ProductListItem>> GetProductsByStoreIdAsync(int storeId);
    Task<ProductResponse> UpdateProductAsync(UpdateProductRequest request);
    Task<bool> DeleteProductAsync(int productId);
    Task<bool> DeactivateProductAsync(int productId);
    Task<bool> ActivateProductAsync(int productId);

    // Category CRUD
    Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request);
    Task<CategoryResponse?> GetCategoryByIdAsync(int categoryId);
    Task<IEnumerable<CategoryListItem>> GetAllCategoriesAsync();
    Task<CategoryResponse> UpdateCategoryAsync(UpdateCategoryRequest request);
    Task<bool> DeleteCategoryAsync(int categoryId);
    Task<bool> DeactivateCategoryAsync(int categoryId);
    Task<bool> ActivateCategoryAsync(int categoryId);
}