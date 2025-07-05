using StoreApp.Model.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public interface IAuditLogRepository
{
    Task<IEnumerable<ProductRequestAuditLogResponse>> GetAuditLogsByRequestIdAsync(int requestId);
    Task<IEnumerable<ProductRequestAuditLogResponse>> GetAuditLogsByDispatchIdAsync(int dispatchId);
    Task<IEnumerable<ProductRequestAuditLogResponse>> GetAllAuditLogsAsync();
}