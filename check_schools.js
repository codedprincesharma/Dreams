import mongoose from 'mongoose';
import School from './src/models/school.model.js';
import env_config from './src/config/env.config.js';

async function checkSchools() {
  await mongoose.connect(env_config.MONGO_URI);
  const schools = await School.find({});
  console.log("Total Schools:", schools.length);
  schools.forEach(s => console.log(`- ${s.school_name}`));
  process.exit(0);
}

checkSchools();
