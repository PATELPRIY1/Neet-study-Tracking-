require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { VITE_API_URL } = process.env;


const startServer = async () => {
  await connectDB();
  app.listen(VITE_API_URL || 3000, () => {
    console.log('Server is running on port ' + (VITE_API_URL || 3000));
  });
};

startServer();