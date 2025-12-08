import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Sale from '../models/Sale.js';

dotenv.config();

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    let skippedRows = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        try {
          // Helper function to safely parse numbers
          const safeParseInt = (value) => {
            const parsed = parseInt(value);
            return isNaN(parsed) ? null : parsed;
          };

          const safeParseFloat = (value) => {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
          };

          // Transform CSV data to match schema
          const age = safeParseInt(data['Age'] || data.age);
          const quantity = safeParseInt(data['Quantity'] || data.quantity);

          // Skip rows with invalid required fields
          if (!age || !quantity) {
            skippedRows++;
            return;
          }

          const sale = {
            customerId: data['Customer ID'] || data.customerId,
            customerName: data['Customer Name'] || data.customerName,
            phoneNumber: data['Phone Number'] || data.phoneNumber,
            gender: data['Gender'] || data.gender,
            age: age,
            customerRegion: data['Customer Region'] || data.customerRegion,
            customerType: data['Customer Type'] || data.customerType,
            productId: data['Product ID'] || data.productId,
            productName: data['Product Name'] || data.productName,
            brand: data['Brand'] || data.brand,
            productCategory: data['Product Category'] || data.productCategory,
            tags: (data['Tags'] || data.tags) ? (data['Tags'] || data.tags).split(',').map(tag => tag.trim()) : [],
            quantity: quantity,
            pricePerUnit: safeParseFloat(data['Price per Unit'] || data.pricePerUnit),
            discountPercentage: safeParseFloat(data['Discount Percentage'] || data.discountPercentage),
            totalAmount: safeParseFloat(data['Total Amount'] || data.totalAmount),
            finalAmount: safeParseFloat(data['Final Amount'] || data.finalAmount),
            date: new Date(data['Date'] || data.date),
            paymentMethod: data['Payment Method'] || data.paymentMethod,
            orderStatus: data['Order Status'] || data.orderStatus,
            deliveryType: data['Delivery Type'] || data.deliveryType,
            storeId: data['Store ID'] || data.storeId,
            storeLocation: data['Store Location'] || data.storeLocation,
            salespersonId: data['Salesperson ID'] || data.salespersonId,
            employeeName: data['Employee Name'] || data.employeeName
          };

          results.push(sale);
        } catch (error) {
          skippedRows++;
          console.warn('Skipping invalid row:', error.message);
        }
      })
      .on('end', () => {
        if (skippedRows > 0) {
          console.log(`Skipped ${skippedRows} invalid rows`);
        }
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing data...');
    await Sale.deleteMany({});

    console.log('Reading CSV file...');
    const filePath = process.argv[2] || './data/sales_data.csv';

    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      console.log('Please provide the path to the CSV file as an argument:');
      console.log('npm run seed /path/to/sales_data.csv');
      process.exit(1);
    }

    const salesData = await parseCSV(filePath);
    console.log(`Parsed ${salesData.length} records from CSV`);

    console.log('Inserting data into database...');
    const batchSize = 1000;
    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize);
      await Sale.insertMany(batch);
      console.log(`Inserted ${Math.min(i + batchSize, salesData.length)} / ${salesData.length} records`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
