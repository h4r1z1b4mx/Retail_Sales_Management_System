# Quick Setup Guide

## Prerequisites Check
Before starting, ensure you have:
- [ ] Node.js v18+ installed (`node --version`)
- [ ] MongoDB installed and running (`mongod --version`)
- [ ] CSV data file downloaded from the assignment

## Step-by-Step Setup

### 1. Install All Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Backend
```bash
cd backend

# The .env file is already created, but verify it:
cat .env

# Should show:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/retail_sales
# NODE_ENV=development
```

### 3. Start MongoDB
Open a new terminal and start MongoDB:
```bash
# On Ubuntu/Debian
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

### 4. Download and Prepare Data
1. Download the sales data CSV from the assignment link
2. Place it in the project root or note its path

### 5. Seed the Database
```bash
cd backend
npm run seed /path/to/your/sales_data.csv

# Example:
# npm run seed ~/Downloads/sales_data.csv
```

Wait for the seeding to complete. You should see progress messages.

### 6. Start the Application

**Option A: Start both servers together (recommended)**
From the project root:
```bash
npm run dev
```

**Option B: Start separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### 8. Test API Endpoints
```bash
# Get filter options
curl http://localhost:5000/api/filter-options

# Get sales data (first page)
curl http://localhost:5000/api/sales?page=1&limit=10

# Get statistics
curl http://localhost:5000/api/statistics

# Search example
curl "http://localhost:5000/api/sales?search=Neha"

# Filter example
curl "http://localhost:5000/api/sales?gender[]=Female&productCategory[]=Clothing"
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Try connecting manually
mongo
# or for newer versions:
mongosh
```

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Backend: Edit backend/.env and change PORT
PORT=5001

# Frontend: Edit frontend/vite.config.js and change server.port
```

### CSV Seeding Fails
- Ensure the CSV file path is correct
- Check file permissions
- Verify CSV format matches expected columns

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy configuration in `frontend/vite.config.js`

## Verification Checklist
- [ ] MongoDB is running
- [ ] Database is seeded with data
- [ ] Backend starts without errors on port 5000
- [ ] Frontend starts without errors on port 3000
- [ ] Can access frontend in browser
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Sorting changes the order
- [ ] Pagination shows correct data
- [ ] Statistics display properly

## Next Steps for Deployment

### Frontend Deployment (Vercel/Netlify)
1. Create production build:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder

3. Set environment variable:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables:
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=production
```

### MongoDB Atlas (Cloud Database)
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI in backend environment

## Development Tips
- Use `npm run dev` from root to run both servers
- MongoDB data persists between restarts
- To re-seed: Drop database and run seed script again
- Check `docs/architecture.md` for detailed system design

## Support
For issues or questions:
1. Check the README.md
2. Review architecture.md in docs/
3. Inspect browser console for frontend errors
4. Check backend terminal for API errors
