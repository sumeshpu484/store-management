using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StoreApp.Data;
using StoreApp.Data.Repositories;
using StoreApp.Services.Configurations;
using StoreApp.Services.Persons;

namespace StoreApp.Services.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Register repositories and services
        services.AddScoped<IPersonRepository, PersonRepository>();
        services.AddScoped<IPersonService, PersonService>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IConfigurationService, ConfigurationService>();

        return services;
    }
}