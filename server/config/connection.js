// Import mongoose for MongoDB connection
const mongoose = require('mongoose');

// Connect to MongoDB using environment variable or default local URI
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

// Load environment variables from a .env file into process.env using dotenv
require('dotenv').config();

// Export mongoose connection for use in other modules
module.exports = mongoose.connection;
