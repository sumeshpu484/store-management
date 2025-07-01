using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyWebApi.Repositories;
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
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.EnableRetryOnFailure());
        });

    

        return services;
    }
}