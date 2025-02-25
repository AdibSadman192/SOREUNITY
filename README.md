# SOREUNITY - Enterprise Resource Planning System

<div align="center">

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Supabase](https://img.shields.io/badge/Supabase-latest-green)

</div>

## Overview

SOREUNITY is a comprehensive Enterprise Resource Planning (ERP) system built with modern web technologies. It provides integrated management of main business processes in real-time, offering modules for inventory management, point of sale, finance, HR, and more.

## 🚀 Features

- **Authentication & Authorization**
  - Role-based access control (Manager/Staff)
  - Secure login and session management
  - Protected routes and middleware security

- **Dashboard**
  - Role-specific dashboards
  - Real-time business metrics
  - Interactive data visualization

- **Core Modules**
  - Inventory Management
  - Point of Sale (POS)
  - Financial Management
  - Human Resources
  - Business Intelligence
  - Customer Management
  - Shipping & Logistics
  - Support System
  - System Health Monitoring

## 🛠 Tech Stack

- **Frontend**
  - Next.js 14 (React Framework)
  - TypeScript
  - Tailwind CSS
  - React Testing Library

- **Backend**
  - Supabase (Backend as a Service)
  - PostgreSQL Database
  - Edge Functions

- **Testing & Quality**
  - Jest
  - React Testing Library
  - ESLint
  - TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd SOREUNITY
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Configure your Supabase credentials

4. **Database Setup**
   - Execute SQL scripts in `db_command` folder in sequence:
     ```bash
     01_initial_schema.sql
     02_module_schema.sql
     03_mock_data.sql
     ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🏗 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard views
│   └── [modules]/      # Various module pages
├── components/         # Reusable components
├── lib/               # Utilities and configurations
│   ├── supabase/      # Supabase client setup
│   └── dev-tools/     # Development utilities
└── __tests__/         # Test files
```

## 🚧 Current Status

- **Completed**
  - Authentication system
  - Basic dashboard structure
  - Database schema design
  - Core routing and middleware

- **In Progress**
  - Module implementations
  - Testing coverage
  - UI/UX improvements

- **Planned**
  - Advanced reporting
  - Mobile responsiveness
  - Performance optimizations
  - Integration testing

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Documentation](docs/)
- [API Reference](docs/api/)
- [Deployment Guide](docs/deployment/)

---

<div align="center">
Made with ❤️ by the SOREUNITY Team
</div>
