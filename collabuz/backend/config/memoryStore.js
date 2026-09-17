// In-Memory Storage Fallback for seamless execution even without local MongoDB service
const crypto = require('crypto');

let users = [
  {
    _id: 'usr_admin',
    name: 'System Administrator',
    email: 'admin@collabuz.com',
    role: 'admin',
    collegeName: '',
    phone: '9876543210'
  },
  {
    _id: 'usr_college1',
    name: 'Stanford University Events',
    email: 'host@stanford.edu',
    role: 'college',
    collegeName: 'Stanford University',
    phone: '9876543211'
  },
  {
    _id: 'usr_college2',
    name: 'MIT Student Council',
    email: 'host@mit.edu',
    role: 'college',
    collegeName: 'Massachusetts Institute of Technology (MIT)',
    phone: '9876543212'
  },
  {
    _id: 'usr_college3',
    name: 'IIT Tech Fest Cell',
    email: 'host@iit.edu',
    role: 'college',
    collegeName: 'Indian Institute of Technology (IIT)',
    phone: '9876543213'
  },
  {
    _id: 'usr_student1',
    name: 'Aarav Sharma',
    email: 'student@collabuz.com',
    role: 'user',
    phone: '9123456789'
  }
];

let events = [
  {
    _id: 'evt_101',
    collegeId: 'usr_college1',
    collegeName: 'Stanford University',
    title: 'Stanford AI & Robotics Hackathon 2026',
    description: 'Join the world’s premier 48-hour student hackathon. Build next-gen AI models, autonomous drones, and smart devices with mentorship from top Silicon Valley tech leaders.',
    category: 'Technical',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    location: 'Stanford Memorial Auditorium',
    date: '2026-10-15',
    time: '09:00 AM',
    ticketTypes: [
      { name: 'Student Pass', price: 299, totalQty: 250, soldQty: 85 },
      { name: 'VIP Pass', price: 699, totalQty: 50, soldQty: 22 }
    ],
    status: 'published'
  },
  {
    _id: 'evt_102',
    collegeId: 'usr_college1',
    collegeName: 'Stanford University',
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
    _id: 'evt_103',
    collegeId: 'usr_college2',
    collegeName: 'Massachusetts Institute of Technology (MIT)',
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
    _id: 'evt_104',
    collegeId: 'usr_college2',
    collegeName: 'Massachusetts Institute of Technology (MIT)',
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
    _id: 'evt_105',
    collegeId: 'usr_college3',
    collegeName: 'Indian Institute of Technology (IIT)',
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
  }
];

let orders = [
  {
    _id: 'ord_101',
    userId: 'usr_student1',
    userName: 'Aarav Sharma',
    userEmail: 'student@collabuz.com',
    eventId: 'evt_101',
    eventTitle: 'Stanford AI & Robotics Hackathon 2026',
    collegeName: 'Stanford University',
    eventDate: '2026-10-15 (09:00 AM)',
    eventLocation: 'Stanford Memorial Auditorium',
    tickets: [{ name: 'Student Pass', price: 299, qty: 2 }],
    totalAmount: 598,
    paymentStatus: 'completed',
    razorpayOrderId: 'order_sim_101',
    razorpayPaymentId: 'pay_sim_101',
    ticketCode: 'CBZ-2026-A1B2',
    createdAt: new Date()
  }
];

module.exports = { users, events, orders };
