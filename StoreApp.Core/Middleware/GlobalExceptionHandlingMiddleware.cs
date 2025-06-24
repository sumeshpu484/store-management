using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Serilog;
using StoreApp.Core.Exceptions;
using StoreApp.Core.Models;

namespace StoreApp.Core.Middleware;

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var errorResponse = CreateErrorResponse(exception);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)GetStatusCode(exception);

        // Log the error
        _logger.Error(exception, "An unhandled exception occurred: {ErrorMessage}", exception.Message);

        var result = JsonSerializer.Serialize(errorResponse);
        await context.Response.WriteAsync(result);
    }

    private static ErrorResponse CreateErrorResponse(Exception exception)
    {
        return exception switch
        {
            ApiException apiException => new ErrorResponse(
                apiException.Message,
                apiException.InnerException?.Message,
                apiException.AdditionalData),
                
            _ => new ErrorResponse(
                "An error occurred while processing your request.",
                exception.Message)
        };
    }

    private static HttpStatusCode GetStatusCode(Exception exception)
    {
        return exception switch
        {
            ApiException apiException => apiException.StatusCode,
            _ => HttpStatusCode.InternalServerError
        };
    }
}