# Testing Guide

This document provides comprehensive testing instructions for the Retail Sales Management System.

## Manual Testing Checklist

### 1. Search Functionality

#### Test: Basic Search
- [ ] Enter "Neha" in search bar
- [ ] Results show only customers named Neha
- [ ] Search is case-insensitive (try "NEHA", "neha")
- [ ] Statistics update to reflect filtered results

#### Test: Phone Number Search
- [ ] Enter phone number in search bar
- [ ] Results show matching customer
- [ ] Partial phone numbers work

#### Test: No Results
- [ ] Search for non-existent name "XYZ123ABC"
- [ ] Table shows "No transactions found"
- [ ] No errors in console

#### Test: Search with Filters
- [ ] Apply a filter (e.g., Gender: Female)
- [ ] Search for a name
- [ ] Results respect both search and filter

#### Test: Clear Search
- [ ] Type in search
- [ ] Clear search field
- [ ] All results return (respecting active filters)

---

### 2. Filter Functionality

#### Test: Single Filter
- [ ] Select one Customer Region
- [ ] Results filter correctly
- [ ] Statistics update

#### Test: Multi-Select Filter
- [ ] Select multiple genders (Male, Female)
- [ ] Results include both genders
- [ ] Deselect one option
- [ ] Results update immediately

#### Test: Age Range Filter
- [ ] Set ageMin to 25
- [ ] Only ages >= 25 show
- [ ] Set ageMax to 30
- [ ] Only ages 25-30 show
- [ ] Invalid range (min > max) handled gracefully

#### Test: Date Range Filter
- [ ] Select date range (e.g., Sept 2023)
- [ ] Only transactions in range show
- [ ] Statistics reflect date range

#### Test: Combined Filters
- [ ] Select multiple filters:
  - Customer Region: North
  - Gender: Female
  - Product Category: Clothing
- [ ] Results match ALL criteria (AND logic)
- [ ] Statistics calculate correctly

#### Test: Reset Filters
- [ ] Apply multiple filters
- [ ] Click "Reset Filters"
- [ ] All filters clear
- [ ] All results return
- [ ] Statistics show totals

#### Test: Conflicting Filters
- [ ] Apply filters that return no results
- [ ] Table shows "No transactions found"
- [ ] Statistics show zeros
- [ ] No errors occur

---

### 3. Sorting Functionality

#### Test: Date Sorting
- [ ] Sort by "Date (Newest First)"
- [ ] Most recent dates appear first
- [ ] Sort by "Date (Oldest First)"
- [ ] Oldest dates appear first

#### Test: Quantity Sorting
- [ ] Sort by "Quantity (High to Low)"
- [ ] Highest quantities first
- [ ] Sort by "Quantity (Low to High)"
- [ ] Lowest quantities first

#### Test: Name Sorting
- [ ] Sort by "Customer Name (A-Z)"
- [ ] Names in alphabetical order
- [ ] Sort by "Customer Name (Z-A)"
- [ ] Names in reverse alphabetical order

#### Test: Sort with Filters
- [ ] Apply filters
- [ ] Change sort order
- [ ] Filters remain active
- [ ] Sorted results respect filters

---

### 4. Pagination Functionality

#### Test: Basic Navigation
- [ ] Page 1 shows first 10 items
- [ ] Click "Next"
- [ ] Page 2 shows next 10 items
- [ ] Click "Previous"
- [ ] Returns to page 1

#### Test: Boundary Conditions
- [ ] On page 1, "Previous" button is disabled
- [ ] Navigate to last page
- [ ] "Next" button is disabled
- [ ] Page info shows correct range

#### Test: Pagination with Filters
- [ ] Apply filter that returns 25 results
- [ ] Should have 3 pages (10, 10, 5)
- [ ] Navigate through all pages
- [ ] Filters persist on each page

#### Test: Filter Changes Reset Page
- [ ] Go to page 3
- [ ] Change a filter
- [ ] Returns to page 1
- [ ] Shows correct results

#### Test: Search Resets Page
- [ ] Go to page 2
- [ ] Enter search query
- [ ] Returns to page 1
- [ ] Shows search results

---

### 5. Statistics Display

#### Test: Statistics Calculation
- [ ] No filters: Shows total units, amount, discount
- [ ] Apply filter
- [ ] Statistics recalculate for filtered data
- [ ] Numbers match expectations

#### Test: Transaction Count
- [ ] Statistics show correct number of SRs
- [ ] Count matches pagination total
- [ ] Singular/plural text correct ("1 SR" vs "2 SRs")

---

### 6. UI/UX Testing

#### Test: Responsive Design
- [ ] Resize browser window
- [ ] Table scrolls horizontally if needed
- [ ] Layout remains functional

#### Test: Loading States
- [ ] Refresh page
- [ ] Loading spinner appears
- [ ] Data loads
- [ ] Spinner disappears

#### Test: Error States
- [ ] Stop backend server
- [ ] Refresh frontend
- [ ] Error message displays
- [ ] User-friendly error text

#### Test: Copy Phone Number
- [ ] Click copy icon next to phone number
- [ ] Phone number copied to clipboard
- [ ] Paste to verify

#### Test: Dropdown Interactions
- [ ] Open multi-select dropdown
- [ ] Click outside
- [ ] Dropdown closes
- [ ] Selected values persist

---

### 7. Edge Cases

#### Test: Empty Database
- [ ] Clear database
- [ ] Application shows "No transactions found"
- [ ] No JavaScript errors

#### Test: Large Numbers
- [ ] Filter for high-value transactions
- [ ] Numbers formatted with commas (₹89,000)
- [ ] No display issues

#### Test: Special Characters
- [ ] Search for name with special chars (if any)
- [ ] No errors
- [ ] Proper escaping

#### Test: Multiple Rapid Clicks
- [ ] Click pagination buttons rapidly
- [ ] No race conditions
- [ ] Correct page displays

---

## API Testing

### Using curl

#### Test: Get All Sales
```bash
curl http://localhost:5000/api/sales?page=1&limit=10
```
**Expected**: JSON with sales data and pagination info

#### Test: Search
```bash
curl "http://localhost:5000/api/sales?search=Neha"
```
**Expected**: Only Neha's transactions

#### Test: Filter by Gender
```bash
curl "http://localhost:5000/api/sales?gender[]=Female"
```
**Expected**: Only female customers

#### Test: Multiple Filters
```bash
curl "http://localhost:5000/api/sales?gender[]=Female&productCategory[]=Clothing&ageMin=25&ageMax=30"
```
**Expected**: Filtered results matching all criteria

#### Test: Sorting
```bash
curl "http://localhost:5000/api/sales?sortBy=quantity&sortOrder=desc"
```
**Expected**: Results sorted by quantity descending

#### Test: Get Filter Options
```bash
curl http://localhost:5000/api/filter-options
```
**Expected**: All unique filter values

#### Test: Get Statistics
```bash
curl "http://localhost:5000/api/statistics?gender[]=Female"
```
**Expected**: Aggregated stats for females

### Using Postman

1. Import collection with these endpoints:
   - GET /api/sales
   - GET /api/filter-options
   - GET /api/statistics

2. Create environment variables:
   - `base_url`: http://localhost:5000

3. Test all parameter combinations

---

## Performance Testing

### Load Testing with Apache Bench (ab)

#### Test: 100 requests, 10 concurrent
```bash
ab -n 100 -c 10 http://localhost:5000/api/sales
```

**Expected**:
- No failed requests
- Reasonable response time (< 100ms average)

#### Test: Search performance
```bash
ab -n 100 -c 10 "http://localhost:5000/api/sales?search=test"
```

#### Test: Complex filter performance
```bash
ab -n 100 -c 10 "http://localhost:5000/api/sales?gender[]=Female&productCategory[]=Clothing"
```

---

## Database Testing

### Verify Indexes
```javascript
// In MongoDB shell or Compass
db.sales.getIndexes()
```

**Expected indexes**:
- `_id`
- `customerId`
- `customerName`
- `phoneNumber`
- `gender`
- `age`
- `customerRegion`
- `productCategory`
- `tags`
- `date`
- `paymentMethod`
- `quantity`
- Text index on `customerName` and `phoneNumber`

### Query Performance
```javascript
// Check query execution time
db.sales.find({ gender: "Female" }).explain("executionStats")
```

**Expected**:
- Uses index
- `executionTimeMillis < 50ms` for small datasets

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Check for:
- [ ] Layout consistency
- [ ] Functionality works
- [ ] No console errors
- [ ] Dropdowns work
- [ ] Date pickers work

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Dropdowns accessible via keyboard
- [ ] No keyboard traps

### Screen Reader
- [ ] Table headers announced
- [ ] Button labels clear
- [ ] Form inputs labeled
- [ ] Error messages announced

---

## Integration Testing Scenarios

### Scenario 1: Find Female Customers in North Region
1. Select Gender: Female
2. Select Region: North
3. Sort by Name A-Z
4. Navigate to page 2
5. Verify results match criteria

### Scenario 2: Search and Filter Clothing Sales
1. Search "Neha"
2. Filter Category: Clothing
3. Filter Date: September 2023
4. Verify all results match

### Scenario 3: Analyze High-Quantity Sales
1. Sort by Quantity (High to Low)
2. Filter Payment Method: Credit Card
3. Check statistics
4. Export results (if implemented)

---

## Bug Reporting Template

If you find bugs, report them with:

**Title**: Brief description

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: If applicable

**Environment**:
- Browser: Chrome 120
- OS: macOS 14
- Node version: 18.x
- MongoDB version: 6.x

---

## Automated Testing (Future Enhancement)

### Backend Unit Tests (Jest)
```javascript
// Example test for salesService
describe('SalesService', () => {
  it('should filter by gender', async () => {
    const result = await salesService.getSales({ gender: ['Female'] });
    expect(result.data.every(sale => sale.gender === 'Female')).toBe(true);
  });
});
```

### Frontend Component Tests (React Testing Library)
```javascript
// Example test for SearchBar
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('calls onChange when user types', () => {
  const handleChange = jest.fn();
  render(<SearchBar value="" onChange={handleChange} />);

  const input = screen.getByPlaceholderText(/name, phone/i);
  fireEvent.change(input, { target: { value: 'test' } });

  expect(handleChange).toHaveBeenCalledWith('test');
});
```

### E2E Tests (Cypress)
```javascript
// Example E2E test
describe('Sales Management', () => {
  it('should filter and paginate correctly', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="gender-filter"]').click();
    cy.contains('Female').click();
    cy.get('table tbody tr').should('have.length', 10);
    cy.contains('Next').click();
    cy.get('table tbody tr').should('exist');
  });
});
```

---

## Test Data Requirements

For comprehensive testing, ensure your dataset includes:
- [ ] Multiple customer regions
- [ ] All genders
- [ ] Age range: 18-100
- [ ] Various product categories
- [ ] Different payment methods
- [ ] Date range: At least 3 months
- [ ] Mix of quantities (1-100+)
- [ ] Various price points

---

## Success Criteria

All tests pass when:
- ✅ Search returns accurate results
- ✅ Filters work independently and combined
- ✅ Sorting changes order correctly
- ✅ Pagination shows correct pages
- ✅ Statistics calculate accurately
- ✅ No console errors
- ✅ Loading states display
- ✅ Error handling works
- ✅ UI is responsive
- ✅ Performance is acceptable (< 100ms API response)
