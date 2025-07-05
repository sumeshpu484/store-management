using Microsoft.AspNetCore.Mvc;
using StoreApp.Data.Repositories;
using StoreApp.Model.Product;
using System.Threading.Tasks;

namespace StoreApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DispatchController : ControllerBase
{
    private readonly IDispatchRepository _repo;
    public DispatchController(IDispatchRepository repo)
    {
        _repo = repo;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDispatchRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var id = await _repo.CreateDispatchAsync(request);
        return Ok(new { DispatchId = id });
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve([FromBody] ApproveDispatchRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _repo.ApproveDispatchAsync(request);
        return Ok(new { Success = result });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> Reject([FromBody] RejectDispatchRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _repo.RejectDispatchAsync(request);
        return Ok(new { Success = result });
    }

    [HttpGet("{dispatchId}")]
    public async Task<IActionResult> Get(int dispatchId)
    {
        var dispatch = await _repo.GetDispatchByIdAsync(dispatchId);
        if (dispatch == null) return NotFound();
        return Ok(dispatch);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var dispatches = await _repo.GetAllDispatchesAsync();
        return Ok(dispatches);
    }
}
