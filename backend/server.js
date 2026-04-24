require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer();