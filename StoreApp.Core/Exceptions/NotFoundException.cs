using System.Net;

namespace StoreApp.Core.Exceptions;

public class NotFoundException : Exception
{
    public HttpStatusCode StatusCode { get; } = HttpStatusCode.NotFound;

    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string message, Exception? innerException)
        : base(message, innerException)
    {
    }
}