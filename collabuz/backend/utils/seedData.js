const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const Order = require('../models/Order');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabuz', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB connected for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Event.deleteMany({});
    await Order.deleteMany({});

    console.log('Existing collections cleared.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@collabuz.com',
      password: 'admin123', // Will be hashed by pre-save middleware
      role: 'admin',
      phone: '9876543210'
    });

    const college1 = await User.create({
      name: 'Stanford University Events',
      email: 'host@stanford.edu',
      password: 'college123',
      role: 'college',
      collegeName: 'Stanford University',
      phone: '9876543211'
    });

    const college2 = await User.create({
      name: 'MIT Student Council',
      email: 'host@mit.edu',
      password: 'college123',
      role: 'college',
      collegeName: 'Massachusetts Institute of Technology (MIT)',
      phone: '9876543212'
    });

    const college3 = await User.create({
      name: 'IIT Tech Fest Cell',
      email: 'host@iit.edu',
      password: 'college123',
      role: 'college',
      collegeName: 'Indian Institute of Technology (IIT)',
      phone: '9876543213'
    });

    const studentUser = await User.create({
      name: 'Aarav Sharma',
      email: 'student@collabuz.com',
      password: 'user123',
      role: 'user',
      phone: '9123456789'
    });

    const studentUser2 = await User.create({
      name: 'Ananya Verma',
      email: 'ananya@gmail.com',
      password: 'user123',
      role: 'user',
      phone: '9123456780'
    });

    console.log('Users created successfully.');

    // 2. Create Events
    const eventsData = [
      {
        collegeId: college1._id,
        collegeName: college1.collegeName,
        title: 'Stanford AI & Robotics Hackathon 2026',
        description: 'Join the world’s premier 48-hour student hackathon. Build next-gen AI models, autonomous drones, and smart devices with mentorship from top Silicon Valley tech leaders.',
        category: 'Technical',
        bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
        location: 'Stanford Memorial Auditorium & Online Lab',
        date: '2026-10-15',
        time: '09:00 AM',
        ticketTypes: [
          { name: 'Student Pass', price: 299, totalQty: 250, soldQty: 85 },
          { name: 'VIP Pass', price: 699, totalQty: 50, soldQty: 22 }
        ],
        status: 'published'
      },
      {
        collegeId: college1._id,
        collegeName: college1.collegeName,
        title: 'Stanford Spring Music Festival & Night',
        description: 'An unforgettable musical night featuring live bands, celebrity DJs, electronic beats, food trucks, and light shows on the main campus lawn.',
        category: 'Music',
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
        location: 'Frost Amphitheater, Stanford',
        date: '2026-11-05',
        time: '06:00 PM',
        ticketTypes: [
          { name: 'Regular', price: 399, totalQty: 500, soldQty: 310 },
          { name: 'VIP Pass', price: 999, totalQty: 100, soldQty: 74 }
        ],
        status: 'published'
      },
      {
        collegeId: college2._id,
        collegeName: college2.collegeName,
        title: 'MIT Global Innovation & Entrepreneurship Summit',
        description: 'Keynotes by global founders, venture capitalist pitch battles, and product showcases. Network with startup founders and industry pioneers.',
        category: 'Management',
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
        location: 'Kresge Auditorium, MIT Campus',
        date: '2026-10-22',
        time: '10:00 AM',
        ticketTypes: [
          { name: 'Student Pass', price: 199, totalQty: 300, soldQty: 140 },
          { name: 'All-Access', price: 899, totalQty: 80, soldQty: 45 }
        ],
        status: 'published'
      },
      {
        collegeId: college2._id,
        collegeName: college2.collegeName,
        title: 'MIT CyberArena E-Sports Championship',
        description: 'Inter-college Valorant, CS2, and Rocket League tournament with a ₹2,00,000 prize pool. Live broadcast and gaming zone for visitors.',
        category: 'Sports',
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
        location: 'MIT Student Center & Gaming Arena',
        date: '2026-11-18',
        time: '11:00 AM',
        ticketTypes: [
          { name: 'Regular', price: 149, totalQty: 400, soldQty: 190 },
          { name: 'VIP Pass', price: 499, totalQty: 60, soldQty: 38 }
        ],
        status: 'published'
      },
      {
        collegeId: college3._id,
        collegeName: college3.collegeName,
        title: 'IIT TechFest 2026 - National Tech Expo',
        description: 'Asia’s largest science and technology festival. Featuring humanoid robotics exhibitions, drone racing, quantum computing workshops, and guest lectures.',
        category: 'Technical',
        bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
        location: 'IIT Open Air Theatre & Convocation Hall',
        date: '2026-12-01',
        time: '09:30 AM',
        ticketTypes: [
          { name: 'Student Pass', price: 249, totalQty: 1000, soldQty: 450 },
          { name: 'VIP Pass', price: 799, totalQty: 150, soldQty: 110 }
        ],
        status: 'published'
      },
      {
        collegeId: college3._id,
        collegeName: college3.collegeName,
        title: 'IIT Cultural Renaissance Drama & Dance Fiesta',
        description: 'Three days of vibrant street plays, classical and western dance battles, fashion shows, and short film screenings.',
        category: 'Cultural',
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
        location: 'IIT Campus Cultural Center',
        date: '2026-12-10',
        time: '04:00 PM',
        ticketTypes: [
          { name: 'Regular', price: 199, totalQty: 600, soldQty: 280 },
          { name: 'VIP Pass', price: 599, totalQty: 100, soldQty: 55 }
        ],
        status: 'published'
      }
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log('Events created successfully.');

    // 3. Create Sample Orders / Transactions for Analytics
    const sampleOrders = [
      {
        userId: studentUser._id,
        userName: studentUser.name,
        userEmail: studentUser.email,
        eventId: createdEvents[0]._id,
        eventTitle: createdEvents[0].title,
        collegeName: createdEvents[0].collegeName,
        eventDate: createdEvents[0].date,
        eventLocation: createdEvents[0].location,
        tickets: [{ name: 'Student Pass', price: 299, qty: 2 }],
        totalAmount: 598,
        paymentStatus: 'completed',
        razorpayOrderId: 'order_seed_101',
        razorpayPaymentId: 'pay_seed_101',
        ticketCode: 'CBZ-2026-A1B2'
      },
      {
        userId: studentUser2._id,
        userName: studentUser2.name,
        userEmail: studentUser2.email,
        eventId: createdEvents[1]._id,
        eventTitle: createdEvents[1].title,
        collegeName: createdEvents[1].collegeName,
        eventDate: createdEvents[1].date,
        eventLocation: createdEvents[1].location,
        tickets: [{ name: 'VIP Pass', price: 999, qty: 1 }],
        totalAmount: 999,
        paymentStatus: 'completed',
        razorpayOrderId: 'order_seed_102',
        razorpayPaymentId: 'pay_seed_102',
        ticketCode: 'CBZ-2026-C3D4'
      },
      {
        userId: studentUser._id,
        userName: studentUser.name,
        userEmail: studentUser.email,
        eventId: createdEvents[4]._id,
        eventTitle: createdEvents[4].title,
        collegeName: createdEvents[4].collegeName,
        eventDate: createdEvents[4].date,
        eventLocation: createdEvents[4].location,
        tickets: [{ name: 'VIP Pass', price: 799, qty: 2 }],
        totalAmount: 1598,
        paymentStatus: 'completed',
        razorpayOrderId: 'order_seed_103',
        razorpayPaymentId: 'pay_seed_103',
        ticketCode: 'CBZ-2026-E5F6'
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('Sample orders seeded successfully.');

    console.log('✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
