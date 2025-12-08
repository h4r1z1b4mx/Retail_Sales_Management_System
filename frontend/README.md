# Frontend - Retail Sales Management System

## Overview
React-based frontend application providing an intuitive interface for sales data management with real-time search, multi-select filters, and responsive design.

## Tech Stack
- React 18
- Vite
- Axios for API communication
- Custom hooks for state management

## Search Implementation Summary
Implemented real-time search functionality that queries customer names and phone numbers. The search is case-insensitive and triggers API calls with debouncing handled by the backend. Works seamlessly with active filters and sorting.

## Filter Implementation Summary
Multi-select filters implemented using custom dropdown components with checkbox selection. Filters include:
- Customer Region (multi-select)
- Gender (multi-select)
- Age Range (min/max inputs)
- Product Category (multi-select)
- Tags (multi-select)
- Payment Method (multi-select)
- Date Range (from/to date pickers)

All filters work independently and in combination, maintaining state across pagination.

## Sorting Implementation Summary
Dropdown-based sorting with the following options:
- Date (Newest/Oldest First)
- Quantity (High to Low / Low to High)
- Customer Name (A-Z / Z-A)

Sorting preserves active search and filter states.

## Pagination Implementation Summary
Standard pagination with Previous/Next controls, displaying 10 items per page. Shows current range (e.g., "Showing 1 to 10 of 100 entries") and maintains all active filters, search, and sort parameters across page changes.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

The application will start on http://localhost:3000
