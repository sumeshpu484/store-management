using Microsoft.AspNetCore.Mvc;
using StoreApp.Data.Repositories;
using StoreApp.Model.Product;
using System.Threading.Tasks;

namespace StoreApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductRequestController : ControllerBase
{
    private readonly IProductRequestRepository _repo;
    public ProductRequestController(IProductRequestRepository repo)
    {
        _repo = repo;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductRequestRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var id = await _repo.CreateProductRequestAsync(request);
        return Ok(new { RequestId = id });
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve([FromBody] ApproveProductRequestRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _repo.ApproveProductRequestAsync(request);
        return Ok(new { Success = result });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> Reject([FromBody] RejectProductRequestRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _repo.RejectProductRequestAsync(request);
        return Ok(new { Success = result });
    }

    [HttpGet("{requestId}")]
    public async Task<IActionResult> Get(int requestId)
    {
        var req = await _repo.GetProductRequestByIdAsync(requestId);
        if (req == null) return NotFound();
        return Ok(req);
    }

    [HttpGet("{requestId}/auditlog")]
    public async Task<IActionResult> GetAuditLog(int requestId)
    {
        var logs = await _repo.GetProductRequestAuditLogAsync(requestId);
        return Ok(logs);
    }
}
