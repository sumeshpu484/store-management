# Store Management System - Angular Frontend

A modern Angular 17 frontend for the Store Management System, integrated with .NET Core backend.

## Project Overview

This Angular application provides a comprehensive user interface for store management operations, featuring:
- **Authentication & Authorization** with JWT tokens
- **Responsive Sidebar Navigation** with Material Design
- **Dashboard** with key metrics and insights
- **Inventory Management** for products, categories, and stock
- **Sales Management** including POS system and orders
- **User Management** and role-based access control

## Technology Stack

- **Angular 17** with standalone components
- **Angular Material** for UI components
- **Bootstrap 5.3** for responsive layout
- **TypeScript** for type safety
- **RxJS** for reactive programming
- **JWT Authentication** with automatic token refresh

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Development
1. Navigate to the frontend directory:
   ```bash
   cd storemanagement.client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open browser to: `https://localhost:4200`

## Default Login Credentials

For development/testing:
- **Username:** admin | **Password:** admin | **Role:** Administrator
- **Username:** manager | **Password:** manager | **Role:** Manager

## Development Features

- **Hot Reload** - Automatic refresh on code changes
- **Proxy Configuration** - API calls routed to .NET Core backend
- **Mock Data Support** - Develop without backend dependency
- **SSL/HTTPS** - Secure development environment

## Project Structure

```
src/
├── app/
│   ├── layout/              # Main layout with sidebar navigation
│   ├── services/            # Business logic and API services
│   ├── guards/              # Route protection
│   ├── interceptors/        # HTTP request/response handling
│   ├── components/          # Reusable UI components
│   └── assets/              # Static files and mock data
```

## Configuration

### Environment Setup
- Update API endpoints in `auth.service.ts`
- Configure proxy settings in `proxy.conf.json`
- Set mock data flag: `useMockData = true/false`

### Backend Integration
- Ensure .NET Core backend is running on `https://localhost:5001`
- API calls are automatically proxied during development
- JWT tokens are managed automatically

## Build & Deployment

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

## Available Scripts

- `npm start` - Start development server with SSL
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build in watch mode

## Backend Integration

This frontend is designed to work with the .NET Core backend in the parent directory. The system uses:
- JWT authentication
- RESTful API endpoints
- Automatic token refresh
- Protected routes

---

Generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8 and upgraded to Angular 17.
