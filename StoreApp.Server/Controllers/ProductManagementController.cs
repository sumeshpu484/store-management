using Microsoft.AspNetCore.Mvc;
using StoreApp.Data.Repositories;
using StoreApp.Model.Product;
using System.Threading.Tasks;

namespace StoreApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductManagementController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    public ProductManagementController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await _productRepository.CreateProductAsync(request);
        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _productRepository.GetAllProductsAsync();
        return Ok(products);
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetProduct(int productId)
    {
        var product = await _productRepository.GetProductByIdAsync(productId);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try 
        {
            var response = await _productRepository.UpdateProductAsync(request);
            return Ok(response);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> DeleteProduct(int productId)
    {
        var result = await _productRepository.DeleteProductAsync(productId);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPost("{productId}/deactivate")]
    public async Task<IActionResult> DeactivateProduct(int productId)
    {
        var result = await _productRepository.DeactivateProductAsync(productId);
        if (!result)
            return NotFound();

        return Ok(new { Message = "Product deactivated successfully" });
    }

    [HttpPost("{productId}/activate")]
    public async Task<IActionResult> ActivateProduct(int productId)
    {
        var result = await _productRepository.ActivateProductAsync(productId);
        if (!result)
            return NotFound();

        return Ok(new { Message = "Product activated successfully" });
    }

    // Category CRUD
    [HttpPost("category")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var response = await _productRepository.CreateCategoryAsync(request);
        return Ok(response);
    }

    [HttpGet("category")]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _productRepository.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetCategory(int categoryId)
    {
        var category = await _productRepository.GetCategoryByIdAsync(categoryId);
        if (category == null)
            return NotFound();
        return Ok(category);
    }

    [HttpPut("category")]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var response = await _productRepository.UpdateCategoryAsync(request);
            return Ok(response);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("category/{categoryId}")]
    public async Task<IActionResult> DeleteCategory(int categoryId)
    {
        var result = await _productRepository.DeleteCategoryAsync(categoryId);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpPost("category/{categoryId}/deactivate")]
    public async Task<IActionResult> DeactivateCategory(int categoryId)
    {
        var result = await _productRepository.DeactivateCategoryAsync(categoryId);
        if (!result)
            return NotFound();
        return Ok(new { Message = "Category deactivated successfully" });
    }

    [HttpPost("category/{categoryId}/activate")]
    public async Task<IActionResult> ActivateCategory(int categoryId)
    {
        var result = await _productRepository.ActivateCategoryAsync(categoryId);
        if (!result)
            return NotFound();
        return Ok(new { Message = "Category activated successfully" });
    }
}