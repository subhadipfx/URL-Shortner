const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGODB_URL;

const connectDB = async() => {
     await mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true },()=>{
         console.log('Connected');
     });
};

module.exports = connectDB;