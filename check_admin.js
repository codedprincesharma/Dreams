import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import env_config from './src/config/env.config.js';
import bcrypt from 'bcryptjs';

async function check() {
  await mongoose.connect(env_config.MONGO_URI);
  const users = await User.find({});
  console.log("Total Users:", users.length);
  users.forEach(u => console.log(`- ${u.email} (${u.role})`));

  const admin = await User.findOne({ email: 'admin@gmail.com' });
  if (!admin) {
    console.log("Admin not found, creating...");
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log("Admin created successfully with password: admin123");
  } else {
    console.log("Admin already exists.");
  }
  process.exit(0);
}

check();
