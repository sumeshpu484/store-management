using StoreApp.Model.Configurations;

namespace StoreApp.Services.Configurations;

public interface IConfigurationService
{
    List<RoleConfig> GetRoles();
    RoleConfig GetRoleById(int roleId);
    List<CategoryConfig> GetCategories();
    CategoryConfig GetCategoryById(int categoryId);
    UserConfig GetUserConfig();
    ProductConfig GetProductConfig();
}