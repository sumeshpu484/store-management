using System;

namespace StoreApp.Model.Product;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Units { get; set; } = string.Empty;
    public int MinimumStock { get; set; }
    public int MaximumStock { get; set; }
    public int CurrentStock { get; set; }
    public int CategoryId { get; set; }
}

public class UpdateProductRequest
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Units { get; set; } = string.Empty;
    public int MinimumStock { get; set; }
    public int MaximumStock { get; set; }
    public int CurrentStock { get; set; }
    public int CategoryId { get; set; }
    public bool IsActive { get; set; }
}

public class ProductResponse
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Units { get; set; } = string.Empty;
    public int MinimumStock { get; set; }
    public int MaximumStock { get; set; }
    public int CurrentStock { get; set; }
    public int CategoryId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductListItem
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Units { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class UpdateCategoryRequest
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CategoryResponse
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime? UpdatedOn { get; set; }
}

public class CategoryListItem
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}