# Architecture Documentation

## System Overview

The Retail Sales Management System follows a three-tier architecture pattern:
1. **Presentation Layer** (React Frontend)
2. **Application Layer** (Express.js API)
3. **Data Layer** (MongoDB Database)

This separation ensures modularity, maintainability, and scalability.

---

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Data Processing**: CSV Parser

### Architecture Pattern
The backend follows the **MVC (Model-View-Controller)** pattern with service layer abstraction:

```
Request Flow:
Client → Routes → Controllers → Services → Models → Database
                                              ↓
                                          Response
```

### Folder Structure

```
backend/src/
├── config/          # Configuration files (database connection)
├── controllers/     # Request handling and response formatting
├── services/        # Business logic and data processing
├── models/          # Mongoose schemas and database models
├── routes/          # API route definitions
├── utils/           # Helper utilities (data seeding)
└── index.js         # Application entry point
```

### Component Responsibilities

#### 1. Models (`models/Sale.js`)
- Define MongoDB schema for sales data
- Establish data validation rules
- Create database indexes for performance
- Configure text search indexes

**Key Features:**
- Indexed fields: customerId, customerName, phoneNumber, gender, age, customerRegion, productCategory, tags, paymentMethod, date, quantity
- Text search index on customerName and phoneNumber
- Timestamps for created/updated tracking

#### 2. Services (`services/salesService.js`)
**Purpose**: Encapsulate business logic and database operations

**Methods:**
- `getSales(queryParams)`: Retrieves filtered, sorted, and paginated sales data
  - Builds dynamic MongoDB queries based on filters
  - Handles search with regex patterns
  - Implements multi-select filters using `$in` operator
  - Applies age and date range filters
  - Executes sorting and pagination
  - Returns data with pagination metadata

- `getFilterOptions()`: Retrieves distinct values for all filter fields
  - Uses MongoDB distinct and aggregation
  - Optimized for dropdown population

- `getStatistics(queryParams)`: Calculates aggregated statistics
  - Uses MongoDB aggregation pipeline
  - Computes total units, amounts, and discounts
  - Respects active filters

#### 3. Controllers (`controllers/salesController.js`)
**Purpose**: Handle HTTP requests and responses

**Responsibilities:**
- Parse and validate request parameters
- Transform array query parameters (multi-select)
- Call appropriate service methods
- Format and send responses
- Handle errors gracefully

#### 4. Routes (`routes/salesRoutes.js`)
**Purpose**: Define API endpoints and map to controllers

**Endpoints:**
- `GET /api/sales` → `salesController.getSales`
- `GET /api/filter-options` → `salesController.getFilterOptions`
- `GET /api/statistics` → `salesController.getStatistics`

#### 5. Configuration (`config/database.js`)
**Purpose**: Database connection management

**Features:**
- MongoDB connection with error handling
- Connection pooling
- Graceful shutdown handling

#### 6. Utilities (`utils/seedData.js`)
**Purpose**: Database seeding from CSV files

**Features:**
- Stream-based CSV parsing for memory efficiency
- Batch insertion (1000 records at a time)
- Data transformation and validation
- Progress logging

### Data Flow

1. **Request Reception**:
   - Client sends HTTP request to Express server
   - Request passes through middleware (CORS, JSON parsing)

2. **Routing**:
   - Express router matches URL pattern
   - Routes to appropriate controller method

3. **Controller Processing**:
   - Extracts and validates query parameters
   - Transforms array parameters for multi-select filters
   - Passes to service layer

4. **Service Layer**:
   - Builds MongoDB query object
   - Constructs filter conditions
   - Applies sorting criteria
   - Calculates pagination offsets
   - Executes database operations

5. **Database Query**:
   - MongoDB executes optimized queries using indexes
   - Returns matching documents

6. **Response Formation**:
   - Service formats data with metadata
   - Controller sends JSON response
   - Client receives structured data

### Query Optimization

**Indexing Strategy:**
- Single-field indexes on frequently filtered fields
- Text index for search functionality
- Compound indexes considered for common filter combinations

**Query Patterns:**
- Use of `$in` operator for multi-select filters
- `$gte` and `$lte` for range queries
- `$regex` with case-insensitive flag for search
- `lean()` queries to return plain JavaScript objects
- Parallel execution of independent queries using `Promise.all`

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect, useCallback)

### Architecture Pattern
The frontend follows a **Component-based Architecture** with custom hooks for state management:

```
App Component
├── Sidebar Component
└── Main Content
    ├── SearchBar Component
    ├── Filters Component
    │   └── MultiSelect Components
    ├── Statistics Component
    ├── SalesTable Component
    └── Pagination Component
```

### Folder Structure

```
frontend/src/
├── components/      # Reusable React components
├── hooks/           # Custom React hooks (useSales)
├── services/        # API communication layer
├── styles/          # CSS stylesheets
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

### Component Responsibilities

#### 1. Custom Hooks (`hooks/useSales.js`)
**Purpose**: Centralized state management and API communication

**State Management:**
- `sales`: Array of sale records
- `statistics`: Aggregated statistics object
- `filterOptions`: Available filter options from backend
- `pagination`: Pagination metadata
- `loading`: Loading state indicator
- `error`: Error message state
- `filters`: Current filter/search/sort parameters

**Methods:**
- `fetchSales(filters)`: Retrieves sales data and statistics
- `fetchFilterOptions()`: Loads filter dropdown options
- `updateFilters(newFilters)`: Updates filter state (resets page to 1)
- `resetFilters()`: Clears all filters

**Optimization:**
- Uses `useCallback` to memoize functions
- Automatic refetch on filter changes via `useEffect`
- Parallel API calls for sales and statistics

#### 2. Components

**App.jsx** (Main Container)
- Manages overall layout
- Coordinates child components
- Handles state from useSales hook
- Passes props to child components

**Sidebar.jsx**
- Navigation menu
- User profile display
- Static component (no state)

**SearchBar.jsx**
- Search input field
- Controlled component
- Triggers filter updates on change

**MultiSelect.jsx** (Reusable)
- Custom dropdown with checkboxes
- Manages open/close state
- Click-outside detection
- Multi-selection logic
- Used by multiple filters

**Filters.jsx**
- Container for all filter controls
- Renders MultiSelect components
- Handles age range inputs
- Date range inputs
- Reset functionality

**Statistics.jsx**
- Displays aggregated metrics
- Total units sold
- Total amount with transaction count
- Total discount with transaction count
- Responsive grid layout

**SalesTable.jsx**
- Displays sales records in table format
- Sort dropdown integration
- Phone number copy functionality
- Date formatting
- Empty state handling

**Pagination.jsx**
- Previous/Next navigation
- Current page information
- Disabled state for boundary pages
- Calculates item ranges

#### 3. Services (`services/api.js`)
**Purpose**: API communication abstraction

**Functions:**
- `getSales(params)`: Fetches sales data with filters
- `getFilterOptions()`: Retrieves filter options
- `getStatistics(params)`: Fetches statistics

**Features:**
- Axios instance with base URL configuration
- Error handling and transformation
- Request parameter serialization

### Data Flow

1. **Initial Load**:
   - App component mounts
   - `useSales` hook initializes
   - `fetchFilterOptions()` loads dropdown data
   - `fetchSales()` loads initial data (page 1, default sort)

2. **User Interaction**:
   - User types in search → `updateFilters({ search })`
   - User selects filter → `updateFilters({ filterName: value })`
   - User changes sort → `updateFilters({ sortBy, sortOrder })`
   - User navigates pages → `updateFilters({ page })`

3. **State Update**:
   - Filter state updates
   - `useEffect` detects change
   - `fetchSales()` called with new filters

4. **API Request**:
   - Service builds API call with query parameters
   - Axios sends GET request to backend
   - Backend processes and responds

5. **Response Handling**:
   - Success: Update sales, pagination, statistics states
   - Error: Update error state
   - Finally: Set loading to false

6. **Re-render**:
   - React re-renders affected components
   - Table shows new data
   - Pagination updates
   - Statistics refresh

### State Management Strategy

**Why Custom Hook Instead of Redux/Context?**
- Centralized state in `useSales` hook
- Simpler for single-feature application
- Reduces boilerplate code
- Easy to test and maintain
- Performance: No prop drilling, direct subscription

**State Updates:**
- All filter updates reset page to 1
- Search triggers filter update
- Sort changes preserve other filters
- Page changes preserve all filters

### Performance Considerations

1. **Memoization**:
   - `useCallback` for functions to prevent unnecessary re-renders
   - Stable function references for child components

2. **API Optimization**:
   - Parallel requests for sales and statistics
   - Single source of truth for filter state

3. **Component Optimization**:
   - Controlled components for forms
   - Event handler optimization
   - Conditional rendering for loading/error states

4. **UX Enhancements**:
   - Loading spinner during data fetch
   - Error messages for failed requests
   - Empty state handling
   - Disabled pagination buttons at boundaries

---

## Data Flow Architecture

### Complete Request-Response Cycle

```
User Action (Search/Filter/Sort/Paginate)
    ↓
Component Event Handler
    ↓
updateFilters() in useSales hook
    ↓
State Update (filters)
    ↓
useEffect Trigger
    ↓
fetchSales(filters)
    ↓
API Service (getSales/getStatistics)
    ↓
HTTP GET Request
    ↓
Express Router
    ↓
Controller (parse params)
    ↓
Service (build query)
    ↓
MongoDB Query Execution
    ↓
Database Results
    ↓
Service (format response)
    ↓
Controller (send JSON)
    ↓
API Service (receive response)
    ↓
useSales Hook (update state)
    ↓
React Re-render
    ↓
Updated UI Display
```

---

## Database Schema

### Sales Collection

```javascript
{
  // Customer Fields
  customerId: String (indexed),
  customerName: String (indexed, text search),
  phoneNumber: String (indexed, text search),
  gender: String (indexed),
  age: Number (indexed),
  customerRegion: String (indexed),
  customerType: String,

  // Product Fields
  productId: String,
  productName: String,
  brand: String,
  productCategory: String (indexed),
  tags: [String] (indexed),

  // Sales Fields
  quantity: Number (indexed),
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,

  // Operational Fields
  date: Date (indexed),
  paymentMethod: String (indexed),
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Index Strategy
- Single-field indexes on all filter fields for fast lookups
- Text index on customerName and phoneNumber for search
- Date index for sorting and range queries
- Quantity index for sorting

---

## Module Responsibilities Summary

### Backend Modules

| Module | Responsibility |
|--------|---------------|
| index.js | Application bootstrap, middleware setup, server initialization |
| config/database.js | MongoDB connection management |
| models/Sale.js | Data schema, validation, indexing |
| services/salesService.js | Business logic, query building, data aggregation |
| controllers/salesController.js | Request/response handling, parameter parsing |
| routes/salesRoutes.js | API endpoint definitions |
| utils/seedData.js | CSV import, data transformation |

### Frontend Modules

| Module | Responsibility |
|--------|---------------|
| main.jsx | Application entry, React DOM rendering |
| App.jsx | Layout, component orchestration |
| hooks/useSales.js | State management, API orchestration |
| services/api.js | HTTP communication, error handling |
| components/Sidebar.jsx | Navigation UI |
| components/SearchBar.jsx | Search input |
| components/MultiSelect.jsx | Multi-select dropdown logic |
| components/Filters.jsx | Filter UI container |
| components/Statistics.jsx | Statistics display |
| components/SalesTable.jsx | Data table rendering |
| components/Pagination.jsx | Pagination controls |

---

## Security Considerations

1. **Input Validation**:
   - Query parameter validation in controllers
   - Mongoose schema validation
   - Regex pattern sanitization

2. **CORS Configuration**:
   - Controlled origin access
   - Proper headers configuration

3. **Error Handling**:
   - No sensitive data in error messages
   - Different error messages for dev/prod

4. **Environment Variables**:
   - Database credentials in .env
   - Not committed to version control

---

## Scalability Considerations

### Current Implementation
- Suitable for datasets up to 100K records
- Server-side pagination reduces client load
- Indexed queries for fast filtering

### Future Enhancements
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: For very large datasets
- **CDN**: Static asset delivery
- **API Rate Limiting**: Prevent abuse
- **GraphQL**: More efficient data fetching

---

## Testing Strategy (Recommended)

### Backend
- Unit tests for service methods
- Integration tests for API endpoints
- Database seeding tests
- Load testing for performance

### Frontend
- Component unit tests (Jest + React Testing Library)
- Integration tests for user flows
- E2E tests (Cypress/Playwright)
- Accessibility testing

---

## Deployment Architecture

### Recommended Stack
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Railway, Render, AWS EC2, or DigitalOcean
- **Database**: MongoDB Atlas (managed)
- **Environment**: Separate dev/staging/production

### CI/CD Pipeline
1. Code push to GitHub
2. Automated tests run
3. Build frontend and backend
4. Deploy to staging
5. Manual approval
6. Deploy to production

---

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Maintainable and testable code
- ✅ Scalable foundation
- ✅ Optimized performance
- ✅ Developer-friendly structure
- ✅ Production-ready patterns
