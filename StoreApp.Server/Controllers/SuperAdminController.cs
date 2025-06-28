using Microsoft.AspNetCore.Mvc;

namespace StoreApp.Server.Controllers
{
    [ApiController]
    [Route("superadmin")]
    public class SuperAdminController : ControllerBase
    {
        [HttpPost("createStore")]
        public IActionResult CreateStore([FromBody] object request)
        {
            // TODO: Implement logic
            return Ok();
        }

        [HttpPost("createUser")]
        public IActionResult CreateUser([FromBody] object request)
        {
            // TODO: Implement logic
            return Ok();
        }

        [HttpPost("passwordReset")]
        public IActionResult PasswordReset([FromBody] object request)
        {
            // TODO: Implement logic
            return Ok();
        }

        [HttpPost("lockStore")]
        public IActionResult LockStore([FromBody] object request)
        {
            // TODO: Implement logic
            return Ok();
        }
    }
}
