using Microsoft.AspNetCore.Mvc;
using StoreApp.Model.Store;
using StoreApp.Data.Repositories;
using StoreApp.Services.Email;
using System.Threading.Tasks;

namespace StoreApp.Server.Controllers
{
    /// <summary>
    /// Super Admin controller for store management operations
    /// </summary>
    [ApiController]
    [Route("superadmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly IStoreRepository _storeRepository;
        private readonly IEmailService _emailService;

        public SuperAdminController(IStoreRepository storeRepository, IEmailService emailService)
        {
            _storeRepository = storeRepository;
            _emailService = emailService;
        }

        /// <summary>
        /// Create a new store with default users
        /// </summary>
        /// <param name="request">Store creation request</param>
        /// <returns>Created store information</returns>
        /// <remarks>
        /// **Automatic User Creation:**
        /// 
        /// When a store is created, two default users are automatically generated:
        /// - **Store Maker**: Username: maker_[StoreKey] (e.g., maker_STR001)
        /// - **Store Checker**: Username: checker_[StoreKey] (e.g., checker_STR001)
        /// 
        /// **Default Password:** password123 (securely hashed using BCrypt)
        /// 
        /// **Security Note:** Change default passwords immediately after store creation in production!
        /// 
        /// **Required Fields:**
        /// - StoreName: Unique store name
        /// - StoreKey: Unique store identifier (e.g., STR001)
        /// - Address: Store address
        /// - City: Store city
        /// - State: Store state
        /// - ZipCode: Store zip code
        /// - Phone: Store phone number
        /// </remarks>
        /// <response code="200">Store created successfully with default users</response>
        /// <response code="400">Invalid request data or validation errors</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("createStore")]
        [ProducesResponseType(typeof(CreateStoreResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateStore([FromBody] CreateStoreRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.CreateStoreAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Get list of all stores
        /// </summary>
        /// <returns>List of all stores in the system</returns>
        /// <response code="200">Successfully retrieved stores list</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("storelist")]
        [ProducesResponseType(typeof(IEnumerable<StoreListItem>), 200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ListStores()
        {
            var stores = await _storeRepository.GetAllStoresAsync();
            return Ok(stores);
        }

        /// <summary>
        /// Get detailed information about a specific store
        /// </summary>
        /// <param name="storeId">Store ID</param>
        /// <returns>Store details</returns>
        /// <response code="200">Successfully retrieved store details</response>
        /// <response code="404">Store not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("store/{storeId}")]
        [ProducesResponseType(typeof(StoreListItem), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetStoreDetails(int storeId)
        {
            var store = await _storeRepository.GetStoreByIdAsync(storeId);
            if (store == null)
                return NotFound();
            return Ok(store);
        }

        /// <summary>
        /// Update store information
        /// </summary>
        /// <param name="storeId">Store ID to update</param>
        /// <param name="request">Updated store information</param>
        /// <returns>Updated store information</returns>
        /// <response code="200">Store updated successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="404">Store not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPut("updateStore/{storeId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateStore(int storeId, [FromBody] UpdateStoreRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.UpdateStoreAsync(storeId, request);
            if (response == null)
                return NotFound(new { Message = "Store not found" });
            
            return Ok(new { Success = true, Message = "Store updated successfully", Store = response });
        }

        /// <summary>
        /// Create a new user for a specific store
        /// </summary>
        /// <param name="request">User creation request</param>
        /// <returns>Created user information</returns>
        /// <remarks>
        /// **Default Password:** password123 (securely hashed using BCrypt)
        /// 
        /// **Security Note:** Users should change their password on first login!
        /// </remarks>
        /// <response code="200">User created successfully</response>
        /// <response code="400">Invalid request data or validation errors</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("createUser")]
        [ProducesResponseType(typeof(CreateStoreUserResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateUser([FromBody] CreateStoreUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.CreateStoreUserAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Get list of all users in the system
        /// </summary>
        /// <returns>List of all users with their store associations</returns>
        /// <response code="200">Successfully retrieved users list</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("userlist")]
        [ProducesResponseType(typeof(IEnumerable<StoreUserListItem>), 200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ListUsers()
        {
            var users = await _storeRepository.GetAllUsersAsync();
            return Ok(users);
        }

        /// <summary>
        /// Get all users associated with a specific store
        /// </summary>
        /// <param name="storeId">Store ID to get users for</param>
        /// <returns>List of users for the specified store</returns>
        /// <response code="200">Successfully retrieved store users</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("getStoreUsers/{storeId}")]
        [ProducesResponseType(typeof(IEnumerable<StoreUserListItem>), 200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetStoreUsers(int storeId)
        {
            var users = await _storeRepository.GetUsersByStoreIdAsync(storeId);
            return Ok(users);
        }
       
        /// <summary>
        /// Block/unblock a user account
        /// </summary>
        /// <param name="request">User block request containing user ID</param>
        /// <returns>Result of the block operation</returns>
        /// <response code="200">User blocked/unblocked successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("blockUser")]
        [ProducesResponseType(typeof(BlockUserResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.BlockUserAsync(request);
            return Ok(new { response.UserId, response.Success, response.Message });
        }

        /// <summary>
        /// Block/unblock a store
        /// </summary>
        /// <param name="request">Store block request containing store ID</param>
        /// <returns>Result of the block operation</returns>
        /// <response code="200">Store blocked/unblocked successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("blockStore")]
        [ProducesResponseType(typeof(BlockStoreResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> BlockStore([FromBody] BlockStoreRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.BlockStoreAsync(request);
            return Ok(new { response.StoreId, response.Success, response.Message });
        }

        /// <summary>
        /// Reset a user's password and send new password via email
        /// </summary>
        /// <param name="request">Password reset request containing user ID</param>
        /// <returns>Result of the password reset operation</returns>
        /// <remarks>
        /// **Security Process:**
        /// 1. Generates a new secure random password
        /// 2. Hashes the password using BCrypt
        /// 3. Updates the user's password in the database
        /// 4. Sends the new password to both user and store email addresses
        /// 
        /// **Note:** The new password is only sent via email for security reasons.
        /// </remarks>
        /// <response code="200">Password reset successful - new password sent via email</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("passwordReset")]
        [ProducesResponseType(typeof(PasswordResetResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> PasswordReset([FromBody] PasswordResetRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.PasswordResetAsync(request);
            if (!response.Success)
                return NotFound(new { response.UserId, response.Success, response.Message });

            // Send email to response.StoreEmail with the new password
            await _emailService.SendPasswordResetAsync(response.StoreEmail, response.NewPassword, response.Email);

            return Ok(new
            {
                response.UserId,
                response.Email,
                response.StoreEmail,
                response.Success,
                response.Message
                // Do not return the new password in production responses
            });
        }
    }
}


