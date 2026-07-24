require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./utils/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedData();
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MamaFarm Backend Server running on port ${PORT}`);
    console.log(`API Base URL: http://127.0.0.1:${PORT}/api`);
  });
};

startServer();
