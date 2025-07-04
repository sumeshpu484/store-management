using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using StoreApp.Model.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public class ProductRequestRepository : IProductRequestRepository
{
    private readonly string _connectionString;

    public ProductRequestRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new System.ArgumentNullException("DefaultConnection string is missing in configuration");
    }

    public async Task<int> CreateProductRequestAsync(CreateProductRequestRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"SELECT create_product_request(
            @RequestorName,
            @MakerUserId,
            @Department,
            @RequiredByDate,
            @Purpose,
            @DeliveryLocation,
            @SpecialInstructions,
            @ProductItems::jsonb
        )";
        var productItemsJson = System.Text.Json.JsonSerializer.Serialize(request.ProductItems);
        var requestId = await connection.ExecuteScalarAsync<int>(sql, new {
            request.RequestorName,
            request.MakerUserId,
            request.Department,
            request.RequiredByDate,
            request.Purpose,
            request.DeliveryLocation,
            request.SpecialInstructions,
            ProductItems = productItemsJson
        });
        return requestId;
    }

    public async Task<bool> ApproveProductRequestAsync(ApproveProductRequestRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"SELECT approve_product_request(@RequestId, @CheckerUserId)";
        return await connection.ExecuteScalarAsync<bool>(sql, request);
    }

    public async Task<bool> RejectProductRequestAsync(RejectProductRequestRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"SELECT reject_product_request(@RequestId, @CheckerUserId, @RejectionReason)";
        return await connection.ExecuteScalarAsync<bool>(sql, request);
    }

    public async Task<ProductRequestResponse?> GetProductRequestByIdAsync(int requestId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"
            SELECT * FROM product_requests WHERE request_id = @RequestId;
            SELECT * FROM product_request_details WHERE request_id = @RequestId;
        ";
        using var multi = await connection.QueryMultipleAsync(sql, new { RequestId = requestId });
        var main = await multi.ReadSingleOrDefaultAsync<ProductRequestResponse>();
        if (main == null) return null;
        var details = (await multi.ReadAsync<ProductRequestDetailResponse>()).AsList();
        main.Details = details;
        return main;
    }

    public async Task<IEnumerable<ProductRequestAuditLogResponse>> GetProductRequestAuditLogAsync(int requestId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"SELECT * FROM request_audit_log WHERE request_id = @RequestId ORDER BY action_timestamp;";
        return await connection.QueryAsync<ProductRequestAuditLogResponse>(sql, new { RequestId = requestId });
    }
}
