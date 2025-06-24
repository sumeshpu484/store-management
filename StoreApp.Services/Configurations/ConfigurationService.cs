using Microsoft.Extensions.Configuration;
using StoreApp.Model.Configurations;
using System.Collections.Generic;
using System.Linq;

namespace StoreApp.Services.Configurations;

public class ConfigurationService : IConfigurationService
{
    private readonly IConfiguration _configuration;

    public ConfigurationService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public List<RoleConfig> GetRoles()
    {
        return _configuration.GetSection("Roles").Get<List<RoleConfig>>() ?? new List<RoleConfig>();
    }

    public RoleConfig GetRoleById(int roleId)
    {
        return GetRoles().FirstOrDefault(r => r.role_id == roleId);
    }

    public List<CategoryConfig> GetCategories()
    {
        return _configuration.GetSection("Categories").Get<List<CategoryConfig>>() ?? new List<CategoryConfig>();
    }

    public CategoryConfig GetCategoryById(int categoryId)
    {
        return GetCategories().FirstOrDefault(c => c.category_id == categoryId);
    }

    public UserConfig GetUserConfig()
    {
        return _configuration.GetSection("UserConfig").Get<UserConfig>() ?? new UserConfig
        {
            DefaultPasswordPolicy = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
            MinUsernameLength = 3,
            MaxUsernameLength = 50,
            RequireEmail = true,
            DefaultRoleId = 1
        };
    }

    public ProductConfig GetProductConfig()
    {
        return _configuration.GetSection("ProductConfig").Get<ProductConfig>() ?? new ProductConfig
        {
            MinUnitPrice = 0.01m,
            MaxUnitPrice = 999999.99m,
            RequireBarcode = true,
            DefaultImageUrl = "/images/no-image.png",
            DefaultCategoryId = 1
        };
    }
}