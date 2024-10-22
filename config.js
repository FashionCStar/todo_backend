require('dotenv').config();  // Load environment variables

module.exports = {
  mongoURI: process.env.MONGO_URI,         // Use Mongo URI from environment variables
  jwtSecret: process.env.JWT_SECRET,       // Use JWT secret from environment variables
};
