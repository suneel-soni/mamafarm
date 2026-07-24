# Build a Complete MamaFarm Business Tracker Application

## Project Overview

Build a production-ready full-stack business tracker application for
**MamaFarm**, a sprouts manufacturing and distribution business.

The frontend is already configured with **Next.js**.

Build the complete backend using:

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose

The application should be clean, modern, scalable, mobile responsive,
and follow best practices.

------------------------------------------------------------------------

## Primary Goal

The application should help me manage my entire sprouts business from
one dashboard.

Track: - Raw material purchases - Packaging purchases - Supplier
details - Shop/Customer management - Sprouts production - Daily
deliveries - Payment collection - Pending dues - Profit & Loss -
Inventory - Analytics

Everything should be stored in MongoDB Atlas.

## Tech Stack

### Frontend

-   Next.js
-   React
-   Tailwind CSS
-   Axios
-   React Hook Form
-   Zod
-   TanStack Table
-   React Query

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   dotenv
-   Helmet
-   Morgan
-   Express Validator

## Architecture

Use MVC architecture.

``` text
server/
  controllers/
  routes/
  models/
  middlewares/
  services/
  utils/
  config/
  uploads/
  app.js
  server.js
```

## Modules

1.  Dashboard
    -   KPIs
    -   Charts
    -   Recent activities
2.  Raw Materials
    -   CRUD
    -   Supplier
    -   Quantity
    -   Unit
    -   Purchase price
    -   GST
    -   Invoice
    -   Payment status
3.  Suppliers
    -   Contact
    -   Address
    -   Purchase history
    -   Pending payments
4.  Shops
    -   Shop details
    -   Outstanding balance
    -   Delivery history
    -   Payment history
5.  Deliveries
    -   Multiple items
    -   Weight
    -   Quantity
    -   Rate
    -   Payment status
    -   Invoice
6.  Payments
    -   Cash
    -   UPI
    -   Bank
    -   Auto-adjust pending balance
7.  Inventory
    -   Current stock
    -   Remaining quantity
    -   Low stock alerts
    -   Stock valuation
8.  Production
    -   Raw material consumption
    -   Output
    -   Waste
    -   Loss
9.  Expenses
    -   Rent
    -   Electricity
    -   Labour
    -   Transport
    -   Misc
10. Reports

-   Daily
-   Weekly
-   Monthly
-   Shop-wise
-   Supplier-wise
-   Inventory
-   Profit/Loss
-   Export PDF/Excel/CSV

## Business Logic

-   Inventory updates automatically after production.
-   Deliveries update customer outstanding.
-   Payments reduce outstanding automatically.
-   Dashboard refreshes with live totals.
-   Profit = Revenue - Material Cost - Expenses.

## MongoDB Models

-   User
-   Supplier
-   Material
-   Inventory
-   Shop
-   Delivery
-   DeliveryItem
-   Payment
-   Expense
-   Production
-   ActivityLog
-   Settings

## REST APIs

``` text
/api/auth
/api/materials
/api/suppliers
/api/inventory
/api/shops
/api/deliveries
/api/payments
/api/expenses
/api/production
/api/dashboard
/api/reports
```

## UI

-   Premium admin dashboard
-   Responsive
-   Green theme
-   Sidebar
-   Top navbar
-   Search
-   Filters
-   Pagination
-   Toast notifications
-   TanStack Table
-   Recharts
-   Dark mode ready

## Forms

Use React Hook Form + Zod with reusable components, validation, loading
states, success/error toasts, and date pickers.

## Future Ready

Design the application so barcode scanning, QR codes, invoice printing,
WhatsApp sharing, SMS reminders, multi-user roles, and mobile app
support can be added later without major refactoring.

Generate clean, production-ready, modular code with proper folder
structure, reusable components, secure authentication, and scalable
architecture.
