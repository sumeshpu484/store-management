using Microsoft.AspNetCore.Mvc;
using StoreApp.Data.Repositories;
using System.Threading.Tasks;

namespace StoreApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController : ControllerBase
{
    private readonly IAuditLogRepository _repo;
    public AuditController(IAuditLogRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("request/{requestId}")]
    public async Task<IActionResult> GetByRequest(int requestId)
    {
        var logs = await _repo.GetAuditLogsByRequestIdAsync(requestId);
        return Ok(logs);
    }

    [HttpGet("dispatch/{dispatchId}")]
    public async Task<IActionResult> GetByDispatch(int dispatchId)
    {
        var logs = await _repo.GetAuditLogsByDispatchIdAsync(dispatchId);
        return Ok(logs);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _repo.GetAllAuditLogsAsync();
        return Ok(logs);
    }
}