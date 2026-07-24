# Refactor MamaFarm Tracker - Simplify the Application

## Objective

The current application has too many modules and feels over-engineered.

I want to simplify the application into a clean, fast, business-focused dashboard.

## Dashboard
- Material Purchase Summary (date-wise)
- Sales Performance
- Shop Cards

## Material Purchase Summary
- Show purchased materials grouped by date
- Filters: Today, Yesterday, This Week, This Month, Custom Range
- Show Total Purchase Cost, Number of Purchases, Average Purchase Cost

## Sales Performance
- Today's Sales
- Weekly Sales
- Monthly Sales
- Total Revenue
- Pending Collection
- Top Performing Shops
- Daily & Monthly Graphs

## Shop Cards
Each card should contain:
- Shop Image
- Shop Name
- Current Delivered Quantity
- Remaining Payment
- Last Delivery Date
- View Details
- Search & Sorting

## Shop Details Page
- Large Shop Image
- Shop Information
- Summary Cards
- Historical Graphs
- Recent Orders Timeline
- Add New Order
- Return Order
- Shop Ledger

## Business Logic
- Current Quantity = Delivered - Returned
- Pending Payment = Total Amount - Total Received
- Auto update Dashboard and Graphs

## UI
- Premium
- Responsive
- Green Theme
- Rounded Cards
- Soft Shadows
- Fast and Minimal

## Goal
Simple, fast, practical business tracker focused on daily operations.
