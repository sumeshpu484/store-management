using System;

namespace StoreApp.Model.Product;

public class CreateProductRequest
{
    public string ProductSku { get; set; } = string.Empty;
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
    public string ProductSku { get; set; } = string.Empty;
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
    public string ProductSku { get; set; } = string.Empty;
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
    public string ProductSku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Units { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
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

public class CreateProductRequestRequest
{
    public string RequestorName { get; set; } = string.Empty;
    public string MakerUserId { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime RequiredByDate { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string DeliveryLocation { get; set; } = string.Empty;
    public string? SpecialInstructions { get; set; }
    public List<ProductRequestDetailRequest> ProductItems { get; set; } = new();
}

public class ProductRequestDetailRequest
{
    public string ProductSku { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int QuantityRequested { get; set; }
    public string? NotesForItem { get; set; }
}

public class ApproveProductRequestRequest
{
    public int RequestId { get; set; }
    public string CheckerUserId { get; set; } = string.Empty;
}

public class RejectProductRequestRequest
{
    public int RequestId { get; set; }
    public string CheckerUserId { get; set; } = string.Empty;
    public string RejectionReason { get; set; } = string.Empty;
}

public class ProductRequestResponse
{
    public int RequestId { get; set; }
    public string RequestorName { get; set; } = string.Empty;
    public string MakerUserId { get; set; } = string.Empty;
    public string? CheckerUserId { get; set; }
    public string Department { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public DateTime RequiredByDate { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string DeliveryLocation { get; set; } = string.Empty;
    public string? SpecialInstructions { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ProductRequestDetailResponse> Details { get; set; } = new();
}

public class ProductRequestDetailResponse
{
    public int DetailId { get; set; }
    public int RequestId { get; set; }
    public string ProductSku { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int QuantityRequested { get; set; }
    public string? NotesForItem { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ProductRequestAuditLogResponse
{
    public int LogId { get; set; }
    public int RequestId { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string ActionByUserId { get; set; } = string.Empty;
    public DateTime ActionTimestamp { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? Notes { get; set; }
}

public class CreateDispatchRequest
{
    public string DispatchMakerUserId { get; set; } = string.Empty;
    public string DispatchToLocation { get; set; } = string.Empty;
    public int? RequestId { get; set; }
    public List<DispatchItemRequest> DispatchItems { get; set; } = new();
}

public class DispatchItemRequest
{
    public string ProductSku { get; set; } = string.Empty;
    public int QuantityDispatched { get; set; }
    public string? NotesForItem { get; set; }
}

public class ApproveDispatchRequest
{
    public int DispatchId { get; set; }
    public string CheckerUserId { get; set; } = string.Empty;
}

public class RejectDispatchRequest
{
    public int DispatchId { get; set; }
    public string CheckerUserId { get; set; } = string.Empty;
    public string CancellationReason { get; set; } = string.Empty;
}

public class DispatchResponse
{
    public int DispatchId { get; set; }
    public int? RequestId { get; set; }
    public string DispatchMakerUserId { get; set; } = string.Empty;
    public string? DispatchCheckerUserId { get; set; }
    public DateTime DispatchDate { get; set; }
    public string DispatchToLocation { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CancellationReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<DispatchItemResponse> Items { get; set; } = new();
}

public class DispatchItemResponse
{
    public int DispatchItemId { get; set; }
    public int DispatchId { get; set; }
    public string ProductSku { get; set; } = string.Empty;
    public int QuantityDispatched { get; set; }
    public string? NotesForItem { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}