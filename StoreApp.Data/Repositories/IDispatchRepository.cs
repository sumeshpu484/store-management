using StoreApp.Model.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public interface IDispatchRepository
{
    Task<int> CreateDispatchAsync(CreateDispatchRequest request);
    Task<bool> ApproveDispatchAsync(ApproveDispatchRequest request);
    Task<bool> RejectDispatchAsync(RejectDispatchRequest request);
    Task<DispatchResponse?> GetDispatchByIdAsync(int dispatchId);
    Task<IEnumerable<DispatchResponse>> GetAllDispatchesAsync();
}
