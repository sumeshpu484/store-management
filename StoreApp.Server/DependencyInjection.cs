using Microsoft.Extensions.DependencyInjection;
using StoreApp.Data.Repositories;
using StoreApp.Services.Auth;
using StoreApp.Services.Data;

namespace StoreApp.Server
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServerDependencies(this IServiceCollection services)
        {
            // Register repositories
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IStoreRepository, StoreRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            // Register services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDataSeedingService, DataSeedingService>();

            return services;
        }
    }
}
