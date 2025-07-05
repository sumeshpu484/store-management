using StoreApp.Model.Store;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public interface IStoreRepository
{
    Task<CreateStoreResponse> CreateStoreAsync(CreateStoreRequest request);
    Task<IEnumerable<StoreListItem>> GetAllStoresAsync();
    Task<StoreListItem?> GetStoreByIdAsync(int storeId);
    Task<StoreListItem?> UpdateStoreAsync(int storeId, UpdateStoreRequest request);
    Task<CreateStoreUserResponse> CreateStoreUserAsync(CreateStoreUserRequest request);
    Task<IEnumerable<StoreUserListItem>> GetAllUsersAsync();
    Task<IEnumerable<StoreUserListItem>> GetUsersByStoreIdAsync(int storeId);
    Task<BlockUserResponse> BlockUserAsync(BlockUserRequest request);
    Task<UnblockUserResponse> UnblockUserAsync(UnblockUserRequest request);
    Task<BlockStoreResponse> BlockStoreAsync(BlockStoreRequest request);
    Task<PasswordResetResponse> PasswordResetAsync(PasswordResetRequest request);
}