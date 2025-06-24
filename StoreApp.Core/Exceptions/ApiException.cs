using System.Net;

namespace StoreApp.Core.Exceptions;

public class ApiException : Exception
{
    public HttpStatusCode StatusCode { get; }
    public object? AdditionalData { get; }

    public ApiException(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest, object? additionalData = null) 
        : base(message)
    {
        StatusCode = statusCode;
        AdditionalData = additionalData;
    }

    public ApiException(string message, Exception innerException, HttpStatusCode statusCode = HttpStatusCode.BadRequest, object? additionalData = null) 
        : base(message, innerException)
    {
        StatusCode = statusCode;
        AdditionalData = additionalData;
    }
}