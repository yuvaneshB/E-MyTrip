import mongoose from 'mongoose';
import '../models/user.js';
import '../models/category.js';
import '../models/country.js';
import '../models/city.js';
import '../models/destination.js';
import '../models/tour.js';
import '../models/agentTour.js';
import '../models/wishlist.js';
import '../models/booking.js';
import '../models/payment.js';
import '../models/invoice.js';
import '../models/review.js';
import '../models/refund.js';
import '../models/notification.js';
import '../models/activityLog.js';
import '../models/coupon.js';

const startInMemoryMongo = async (reason) => {
  console.warn(`[Database] Falling back to In-Memory MongoDB Server. Reason: ${reason}`);
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] In-Memory MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (innerError) {
    console.error(`Fatal Database Error: ${innerError.message}`);
    process.exit(1);
  }
};

const connectDB = async () => {
  const dbMode = (process.env.DB_MODE || '').toLowerCase().trim();

  // If explicit mock mode requested, spin up in-memory DB directly
  if (dbMode === 'mock') {
    return await startInMemoryMongo('Explicit DB_MODE=mock configured');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds fail-fast limit
      socketTimeoutMS: 15000,        // 15 seconds socket timeout
      connectTimeoutMS: 5000,
      maxPoolSize: 20
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[Database] Mongoose Connection Error: ${err.message}`);
    });

    return conn;
  } catch (error) {
    return await startInMemoryMongo(`Primary connection failed (${error.message})`);
  }
};

export default connectDB;

