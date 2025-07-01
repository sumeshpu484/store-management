using System.ComponentModel.DataAnnotations;

namespace StoreApp.Model.Store;

public class CreateStoreRequest
{
    [Required]
    [StringLength(255)]
    public string StoreName { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string State { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string StoreEmail { get; set; } = string.Empty;
}

public class CreateStoreResponse
{
    public int StoreId { get; set; }
    public int StoreMakerRoleId { get; set; }
    public int StoreCheckerRoleId { get; set; }
    public string StoreName { get; set; } = string.Empty;
    public string StoreMakerEmail { get; set; } = string.Empty;
    public string StoreCheckerEmail { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class StoreListItem
{
    public int StoreId { get; set; }
    public string StoreName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string StoreEmail { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateStoreUserRequest
{
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int RoleId { get; set; }
    public int? StoreId { get; set; }
}

public class CreateStoreUserResponse
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int RoleId { get; set; }
    public int? StoreId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class StoreUserListItem
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int RoleId { get; set; }
    public int? StoreId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string StoreName { get; set; } = string.Empty;
}

public class BlockUserRequest
{
    public Guid UserId { get; set; }
}

public class BlockUserResponse
{
    public Guid UserId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class UnblockUserRequest
{
    public Guid UserId { get; set; }
}

public class UnblockUserResponse
{
    public Guid UserId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class BlockStoreRequest
{
    public int StoreId { get; set; }
}

public class BlockStoreResponse
{
    public int StoreId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class PasswordResetRequest
{
    public Guid UserId { get; set; }
}

public class PasswordResetResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string StoreEmail { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}