const { DATABASE } = require('./constants');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DATABASE.MONGODB_URI, {
            dbName: 'test'
        });
        console.log(`MongoDB Connected ---**---`);
    } catch (error) {
        console.error(`Error mông--: ${error}`);
        process.exit(1);
    }
};

module.exports = connectDB;  