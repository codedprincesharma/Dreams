import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import env_config from './src/config/env.config.js';
import bcrypt from 'bcryptjs';

async function reset() {
  await mongoose.connect(env_config.MONGO_URI);
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const result = await User.updateOne(
    { email: 'admin@gmail.com' },
    { $set: { password: hashedPassword, role: 'admin' } },
    { upsert: true }
  );
  console.log("Admin password reset/created for admin@gmail.com to: admin123");
  process.exit(0);
}

reset();
