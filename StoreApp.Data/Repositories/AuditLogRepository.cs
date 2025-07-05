using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using StoreApp.Model.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreApp.Data.Repositories;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly string _connectionString;

    public AuditLogRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new System.ArgumentNullException("DefaultConnection string is missing in configuration");
    }

    public async Task<IEnumerable<ProductRequestAuditLogResponse>> GetAuditLogsByRequestIdAsync(int requestId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = "SELECT * FROM request_audit_log WHERE request_id = @RequestId ORDER BY action_timestamp ASC;";
        return await connection.QueryAsync<ProductRequestAuditLogResponse>(sql, new { RequestId = requestId });
    }

    public async Task<IEnumerable<ProductRequestAuditLogResponse>> GetAuditLogsByDispatchIdAsync(int dispatchId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = "SELECT * FROM request_audit_log WHERE dispatch_id = @DispatchId ORDER BY action_timestamp ASC;";
        return await connection.QueryAsync<ProductRequestAuditLogResponse>(sql, new { DispatchId = dispatchId });
    }

    public async Task<IEnumerable<ProductRequestAuditLogResponse>> GetAllAuditLogsAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = "SELECT * FROM request_audit_log ORDER BY action_timestamp ASC;";
        return await connection.QueryAsync<ProductRequestAuditLogResponse>(sql);
    }
}