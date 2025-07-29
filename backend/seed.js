require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Job = require('./models/Job');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nottingham.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();

    // Create sample student
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = new User({
      firstName: 'Tom',
      lastName: 'Hiddleston',
      email: 'tomhid@gmail.com',
      password: studentPassword,
      role: 'student'
    });
    await student.save();

    // Create sample jobs
    const jobs = [
      {
        title: 'UX/UI Designer',
        description: 'About the Role: We\'re on the lookout for a talented and detail-oriented UI/UX Designer who can seamlessly blend user-centred design thinking with eye-catching visuals. You\'ll work closely with our product team to create intuitive and engaging user experiences.',
        location: 'Mumbai',
        type: 'Full-Time',
        company: 'Nottingham Building Society'
      },
      {
        title: 'Frontend Developer',
        description: 'We are seeking a skilled Frontend Developer to join our dynamic team. You will be responsible for building responsive, user-friendly web applications using modern technologies like React, JavaScript, and CSS.',
        location: 'Gurugram',
        type: 'Full-Time',
        company: 'Nottingham Building Society'
      },
      {
        title: 'Backend Developer',
        description: 'Join our backend team to build robust, scalable APIs and server-side applications. Experience with Node.js, Express, and MongoDB is preferred.',
        location: 'Remote',
        type: 'Contract',
        company: 'Nottingham Building Society'
      },
      {
        title: 'Full Stack Developer',
        description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend technologies. Experience with MERN stack is highly valued.',
        location: 'Bangalore',
        type: 'Full-Time',
        company: 'Nottingham Building Society'
      }
    ];

    await Job.insertMany(jobs);

    console.log('✅ Database seeded successfully!');
    console.log('Admin credentials: admin@nottingham.com / admin123');
    console.log('Student credentials: tomhid@gmail.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
