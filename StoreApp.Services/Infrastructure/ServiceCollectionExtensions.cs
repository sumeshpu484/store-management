using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace StoreApp.Services.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        //// Register DbContext
        //services.AddDbContext<ApplicationDbContext>(options =>
        //{
        //    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
        //        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure());
        //});

    

        return services;
    }
}