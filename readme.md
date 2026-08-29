# ERP Full-Stack Demo

A full-stack ERP-style application built with **ASP.NET Core, React and TypeScript**, designed to demonstrate a clean separation between frontend and backend services, REST API integration, and maintainable enterprise application structure.

## Tech Stack

### Backend

* ASP.NET Core
* C#
* Entity Framework Core
* REST APIs
* SQLite
* Repository and Service patterns

### Frontend

* React
* TypeScript
* Vite
* REST API integration
* Component-based architecture

## Project Structure

```text
backend/
├── Controllers/
├── Data/
├── Migrations/
├── Models/
├── Repositories/
├── Services/
└── Program.cs

frontend/
├── public/
└── src/
    ├── layout/
    ├── pages/
    ├── components/
    ├── services/
    ├── types/
    └── hooks/
```

The backend follows a layered architecture separating API controllers, business logic and data access. The frontend is organised into reusable React components, services and shared types.

## Key Features

* RESTful API communication between frontend and backend
* CRUD operations for ERP-style business data
* Layered backend architecture using Controllers, Services and Repositories
* Entity Framework Core database integration
* Reusable React and TypeScript components
* Shared frontend service layer for API communication
* Strong typing across frontend models and API responses

## Getting Started

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start through Vite and communicate with the ASP.NET Core backend API.

## Purpose

This project was created as a practical full-stack demonstration of building and structuring an enterprise-style application using modern .NET and React technologies.

It focuses on clean architecture, maintainability, API integration and reusable development patterns.

## Future Improvements

* Authentication and role-based access control
* Automated API and E2E testing
* Docker containerisation
* CI/CD pipeline integration
* Improved validation and error handling
* Additional ERP modules and reporting


