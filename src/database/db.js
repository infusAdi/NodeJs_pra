const mongoose = require("mongoose");
const a = "Aditya";
const port = 7777;
const connectDB = async () => {
  await mongoose.connect("mongodb+srv://adityasen:Aditya0122@cluster0.zgn97.mongodb.net/DevPracNode");
  
};

module.exports = {
  a,
  port,
  connectDB,
};
