# API-Only Development Configuration

## 🎯 Angular Frontend Disabled - API Runs Independently

The .NET Core API has been configured to run **independently** without automatically starting the Angular frontend. This allows you to:

- Run the API server only for backend testing
- Use tools like Postman, Swagger, or curl to test APIs
- Run Angular separately when needed
- Faster API startup times

## ✅ Changes Made

### **1. Program.cs - Disabled Static File Serving**
```csharp
// Temporarily disabled Angular frontend serving for API-only development
// Uncomment these lines when you want to serve Angular with the API
// app.UseDefaultFiles();
// app.UseStaticFiles();

// Temporarily disabled Angular fallback routing for API-only development  
// Uncomment this line when you want to serve Angular with the API
// app.MapFallbackToFile("/index.html");
```

### **2. StoreApp.Server.csproj - Disabled SPA Integration**
```xml
<!-- Temporarily disabled SPA integration for API-only development -->
<!-- 
<SpaRoot>..\storemanagement.client</SpaRoot>
<SpaProxyLaunchCommand>npm start</SpaProxyLaunchCommand>
<SpaProxyServerUrl>https://localhost:4200</SpaProxyServerUrl>
-->

<!-- Temporarily disabled SPA proxy for API-only development -->
<!-- <PackageReference Include="Microsoft.AspNetCore.SpaProxy" Version="8.0.1" /> -->

<!-- Temporarily disabled Angular project reference for API-only development -->
<!--
<ProjectReference Include="..\storemanagement.client\storemanagement.client.esproj">
  <ReferenceOutputAssembly>false</ReferenceOutputAssembly>
</ProjectReference>
-->
```

## 🚀 How to Run

### **API Only (Current Configuration)**
```bash
# Navigate to API project
cd StoreApp.Server

# Run the API
dotnet run
```

**Result**: 
- ✅ API runs at `https://localhost:5001` (or configured port)
- ✅ Swagger UI available at `https://localhost:5001/swagger`
- ✅ No Angular frontend starts automatically
- ✅ Faster startup time

### **Angular Separately (If Needed)**
```bash
# In a separate terminal, navigate to Angular project
cd storemanagement.client

# Install dependencies (if not done)
npm install

# Run Angular development server
npm start
```

**Result**:
- ✅ Angular runs at `https://localhost:4200`
- ✅ Can still call API at `https://localhost:5001`
- ✅ Full development control

## 🔧 Testing the API

### **Available Endpoints:**
- **Swagger UI**: `https://localhost:5001/swagger`
- **Store List**: `GET https://localhost:5001/superadmin/storelist`
- **Create Store**: `POST https://localhost:5001/superadmin/createStore`
- **Get Store Users**: `GET https://localhost:5001/superadmin/getStoreUsers/{storeId}`
- **Block User**: `POST https://localhost:5001/superadmin/blockUser`
- **Password Reset**: `POST https://localhost:5001/superadmin/passwordReset`

### **Testing Tools:**
- ✅ **Swagger UI** (built-in): `https://localhost:5001/swagger`
- ✅ **Postman**: Import endpoints and test
- ✅ **curl**: Command line testing
- ✅ **Browser**: For GET endpoints

## 🔄 To Re-enable Angular Integration

When you want to run both API + Angular together again:

### **Step 1: Restore Program.cs**
```csharp
// Uncomment these lines:
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("/index.html");
```

### **Step 2: Restore StoreApp.Server.csproj**
```xml
<!-- Uncomment these sections: -->
<SpaRoot>..\storemanagement.client</SpaRoot>
<SpaProxyLaunchCommand>npm start</SpaProxyLaunchCommand>
<SpaProxyServerUrl>https://localhost:4200</SpaProxyServerUrl>

<PackageReference Include="Microsoft.AspNetCore.SpaProxy" Version="8.0.1" />

<ProjectReference Include="..\storemanagement.client\storemanagement.client.esproj">
  <ReferenceOutputAssembly>false</ReferenceOutputAssembly>
</ProjectReference>
```

### **Step 3: Run Combined**
```bash
dotnet run
```
This will start both API and Angular together.

## 📊 Current Development Setup

| Component | Status | Port | Access |
|-----------|--------|------|--------|
| **API Server** | ✅ **ACTIVE** | 5001 | `https://localhost:5001` |
| **Swagger UI** | ✅ **ACTIVE** | 5001 | `https://localhost:5001/swagger` |
| **Angular** | ⚠️ **MANUAL** | 4200 | Run separately with `npm start` |
| **Database** | ✅ **ACTIVE** | - | Connected via Entity Framework |

## 🎯 Benefits of This Setup

### **Development Advantages:**
- ✅ **Faster API Startup**: No Angular compilation wait
- ✅ **Independent Testing**: Test APIs without frontend
- ✅ **Better Debugging**: Focus on backend issues
- ✅ **Resource Efficient**: Lower memory usage
- ✅ **Clean Separation**: Frontend and backend development separation

### **API Testing:**
- ✅ **Swagger Integration**: Full API documentation and testing
- ✅ **Direct Endpoint Access**: Test individual endpoints
- ✅ **Database Validation**: Verify data operations
- ✅ **Performance Testing**: Measure API response times

---

## 🎊 Result: API Now Runs Independently

**Status**: ✅ **API-ONLY CONFIGURATION ACTIVE**

You can now run `dotnet run` and the API will start without Angular, allowing you to:
- Test APIs via Swagger UI
- Use Postman for endpoint testing  
- Run Angular separately when needed
- Focus on backend development

**Quick Start**: `cd StoreApp.Server && dotnet run` → API ready at `https://localhost:5001/swagger`
