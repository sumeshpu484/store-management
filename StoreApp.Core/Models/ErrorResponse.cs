namespace StoreApp.Core.Models;

public class ErrorResponse
{
    public string Message { get; set; }
    public string? Detail { get; set; }
    public object? Data { get; set; }

    public ErrorResponse(string message, string? detail = null, object? data = null)
    {
        Message = message;
        Detail = detail;
        Data = data;
    }
}