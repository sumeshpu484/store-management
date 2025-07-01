using Microsoft.AspNetCore.Mvc;
using StoreApp.Model.Store;
using StoreApp.Data.Repositories;
using StoreApp.Services.Email;
using System.Threading.Tasks;

namespace StoreApp.Server.Controllers
{
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

        [HttpPost("createStore")]
        public async Task<IActionResult> CreateStore([FromBody] CreateStoreRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.CreateStoreAsync(request);
            return Ok(response);
        }

        [HttpGet("storelist")]
        public async Task<IActionResult> ListStores()
        {
            var stores = await _storeRepository.GetAllStoresAsync();
            return Ok(stores);
        }

        [HttpGet("store/{storeId}")]
        public async Task<IActionResult> GetStoreDetails(int storeId)
        {
            var store = await _storeRepository.GetStoreByIdAsync(storeId);
            if (store == null)
                return NotFound();
            return Ok(store);
        }

        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUser([FromBody] CreateStoreUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.CreateStoreUserAsync(request);
            return Ok(response);
        }

        [HttpGet("userlist")]
        public async Task<IActionResult> ListUsers()
        {
            var users = await _storeRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("getStoreUsers/{storeId}")]
        public async Task<IActionResult> GetStoreUsers(int storeId)
        {
            var users = await _storeRepository.GetUsersByStoreIdAsync(storeId);
            return Ok(users);
        }
       
        //block user
        [HttpPost("blockUser")]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.BlockUserAsync(request);
            return Ok(new { response.UserId, response.Success, response.Message });
        }

        //blockstore
        [HttpPost("blockStore")]
        public async Task<IActionResult> BlockStore([FromBody] BlockStoreRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _storeRepository.BlockStoreAsync(request);
            return Ok(new { response.StoreId, response.Success, response.Message });
        }

        [HttpPost("passwordReset")]
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


