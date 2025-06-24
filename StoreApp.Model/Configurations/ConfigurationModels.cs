using System.Collections.Generic;

namespace StoreApp.Model.Configurations;

public class RoleConfig
{
    public int role_id { get; set; }
    public string name { get; set; }
    public List<string> permissions { get; set; }
}

public class CategoryConfig
{
    public int category_id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
}

public class UserConfig
{
    public string DefaultPasswordPolicy { get; set; }
    public int MinUsernameLength { get; set; }
    public int MaxUsernameLength { get; set; }
    public bool RequireEmail { get; set; }
    public int DefaultRoleId { get; set; }
}

public class ProductConfig
{
    public decimal MinUnitPrice { get; set; }
    public decimal MaxUnitPrice { get; set; }
    public bool RequireBarcode { get; set; }
    public string DefaultImageUrl { get; set; }
    public int DefaultCategoryId { get; set; }
}