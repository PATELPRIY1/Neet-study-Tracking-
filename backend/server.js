require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');



const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port ' + (process.env.PORT || 3000));
  });
};

startServer();