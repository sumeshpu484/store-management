using StoreApp.Model.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public interface IProductRequestRepository
{
    Task<int> CreateProductRequestAsync(CreateProductRequestRequest request);
    Task<bool> ApproveProductRequestAsync(ApproveProductRequestRequest request);
    Task<bool> RejectProductRequestAsync(RejectProductRequestRequest request);
    Task<ProductRequestResponse?> GetProductRequestByIdAsync(int requestId);
    Task<IEnumerable<ProductRequestAuditLogResponse>> GetProductRequestAuditLogAsync(int requestId);
}
