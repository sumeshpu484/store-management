using Microsoft.Extensions.DependencyInjection;
using StoreApp.Data.Repositories;

namespace StoreApp.Server
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServerDependencies(this IServiceCollection services)
        {
            // Register repositories
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IStoreRepository, StoreRepository>();

            return services;
        }
    }
}
