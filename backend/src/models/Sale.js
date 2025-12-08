import mongoose from "mongoose";


const saleSchema = new mongoose.Schema({
    
    customerId: {
        type: String, 
        required: true, 
        index: true
    }, 
    customerName: {
        type: String, 
        required: true, 
        index: true
    }, 
    phoneNumber: {
        type: String, 
        required: true, 
        index: true 
    }, 
    gender: {
        type: String, 
        enum: ['Male', 'Female', 'Other'],
        index: true 
    }, 
    age: {
        type: Number, 
        required: true, 
        index: true
    }, 
    customerRegion: {
        type: String, 
        required: true, 
        index: true         
    }, 
    customerType: {
        type: String, 
        required: true
    }, 
    productId: {
        type: String, 
        required: true
    }, 
    productName: {
        type: String, 
        required: true 
    }, 
    brand: {
        type: String, 
        required: true
    }, 
    productCategory: {
        type: String, 
        required: true, 
        index: true
    }, tags: {
        type: [String], 
        default: [],
        index: true
    }, 
    quantity: {
        type: Number, 
        required: true, 
        index: true
    }, 
    pricePerUnit: {
        type: Number, 
        required: true
    }, 
    discountPercentage:{
        type: Number, 
        default: 0
    }, 
    totalAmount: {
        type: Number, 
        required: true
    }, 
    finalAmount: {
        type: Number, 
        required: true
    }, 
    date : {
        type: Date, 
        required: true, 
        index: true
    }, 
    paymentMethod: {
        type: String, 
        required: true, 
        index: true
    }, 
    orderStatus: {
        type: String, 
        required: true
    }, 
    deliveryType: {
        type: String, 
        required: true
    }, 
    storeId: {
        type: String, 
        required: true 
    }, storeLocation: {
        type: String, 
        required: true
    }, 
    salespersonId: {
        type: String, 
        required: true 
    },
    employeeName: {
        type: String, 
        required: true
    } 
}, {
    timestamps: true
});

saleSchema.index({customerName: 'text', phoneNumber: 'text'});

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;