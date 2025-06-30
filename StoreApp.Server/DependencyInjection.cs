using Microsoft.Extensions.DependencyInjection;
using StoreApp.Data.Repositories;

namespace StoreApp.Server
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServerDependencies(this IServiceCollection services)
        {
            services.AddScoped<IStoreRepository, StoreRepository>();
            // Add other server-specific DI registrations here
            return services;
        }
    }
}
