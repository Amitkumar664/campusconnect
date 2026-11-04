const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const FacultyProfile = require('../models/FacultyProfile');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Promise.all([
      User.deleteMany({}),
      FacultyProfile.deleteMany({}),
      Resource.deleteMany({}),
      Booking.deleteMany({}),
      Event.deleteMany({}),
      EventRegistration.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('[Seeder] Creating realistic campus users...');
    // 1. Create Users
    // Admin
    const adminUser = await User.create({
      fullName: 'Dr. Rajeshwar Rao (Registrar)',
      email: 'admin@campusconnect.edu',
      password: 'Admin@123',
      role: 'admin',
      department: 'Central Academic Administration',
      studentOrEmployeeId: 'ADM-2026-001',
      phone: '+91 98765 00001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    // Faculty members
    const faculty1 = await User.create({
      fullName: 'Dr. Vikram Sharma',
      email: 'dr.sharma@campusconnect.edu',
      password: 'Faculty@123',
      role: 'faculty',
      department: 'Computer Science & Engineering',
      studentOrEmployeeId: 'FAC-CSE-101',
      phone: '+91 98765 11001',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    const faculty2 = await User.create({
      fullName: 'Prof. Ananya Patel',
      email: 'prof.patel@campusconnect.edu',
      password: 'Faculty@123',
      role: 'faculty',
      department: 'Artificial Intelligence & Data Science',
      studentOrEmployeeId: 'FAC-AID-102',
      phone: '+91 98765 11002',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    const faculty3 = await User.create({
      fullName: 'Dr. Sanjay Kulkarni',
      email: 'dr.kulkarni@campusconnect.edu',
      password: 'Faculty@123',
      role: 'faculty',
      department: 'Electronics & Communication',
      studentOrEmployeeId: 'FAC-ECE-103',
      phone: '+91 98765 11003',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    // Students
    const student1 = await User.create({
      fullName: 'Aarav Mehta',
      email: 'aarav.student@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentOrEmployeeId: 'STU-2023-CS-042',
      phone: '+91 98765 22001',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    const student2 = await User.create({
      fullName: 'Riya Sen',
      email: 'riya.student@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Information Technology',
      studentOrEmployeeId: 'STU-2023-IT-088',
      phone: '+91 98765 22002',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    const student3 = await User.create({
      fullName: 'Vikramaditya Verma',
      email: 'vikram.student@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Artificial Intelligence & Data Science',
      studentOrEmployeeId: 'STU-2023-AI-015',
      phone: '+91 98765 22003',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    console.log('[Seeder] Creating Faculty Profiles with schedule configurations...');
    // 2. Create Faculty Profiles
    await FacultyProfile.create([
      {
        user: faculty1._id,
        designation: 'Professor & Head of Department',
        officeRoom: 'Turing Block, 4th Floor, Cabin 408',
        bio: 'Over 16 years of academic & research experience in Distributed Systems, Operating Systems, and Cloud Architectures.',
        subjects: ['Distributed Systems', 'Cloud Computing', 'Database Internals'],
        weeklyAvailability: [
          { dayOfWeek: 'Monday', startTime: '10:00', endTime: '13:00', slotDurationMinutes: 30 },
          { dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '17:00', slotDurationMinutes: 30 },
          { dayOfWeek: 'Friday', startTime: '10:00', endTime: '12:30', slotDurationMinutes: 30 }
        ],
        acceptingBookings: true
      },
      {
        user: faculty2._id,
        designation: 'Associate Professor',
        officeRoom: 'Aryabhata Research Wing, Cabin 205',
        bio: 'Specialist in Natural Language Processing, Deep Learning Pipelines, and Computer Vision.',
        subjects: ['Machine Learning', 'Deep Learning', 'Data Structures & Algorithms'],
        weeklyAvailability: [
          { dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '15:00', slotDurationMinutes: 30 },
          { dayOfWeek: 'Thursday', startTime: '11:00', endTime: '16:00', slotDurationMinutes: 30 }
        ],
        acceptingBookings: true
      },
      {
        user: faculty3._id,
        designation: 'Assistant Professor',
        officeRoom: 'Bhabha Tech Block, Cabin 302',
        bio: 'Focus on Embedded Systems, Edge IoT Computing, and VLSI circuit verification.',
        subjects: ['Embedded Systems', 'IoT Architectures', 'Signals & Systems'],
        weeklyAvailability: [
          { dayOfWeek: 'Monday', startTime: '14:00', endTime: '17:00', slotDurationMinutes: 45 },
          { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '13:00', slotDurationMinutes: 45 }
        ],
        acceptingBookings: true
      }
    ]);

    console.log('[Seeder] Creating campus classrooms and laboratories...');
    // 3. Create Resources
    const resources = await Resource.create([
      {
        name: 'Alan Turing Advanced Computing Lab',
        code: 'LAB-CS-101',
        type: 'laboratory',
        building: 'Turing Block',
        floor: 'Ground Floor',
        capacity: 65,
        amenities: ['65 Dell Precision i7 Workstations', 'NVIDIA RTX GPUs', 'Dual 4K Projectors', 'High Speed Gigabit LAN'],
        description: 'Specialized lab for Distributed Computing, Systems Programming, and High-Performance Simulation.',
        isActive: true
      },
      {
        name: 'Ada Lovelace AI & Data Science Lab',
        code: 'LAB-CS-204',
        type: 'laboratory',
        building: 'Aryabhata Wing',
        floor: '2nd Floor',
        capacity: 50,
        amenities: ['50 High-Memory Workstations', 'Dual Smartboards', 'Linux Cluster Access', 'Central AC'],
        description: 'Dedicated infrastructure for Deep Learning experiments, NLP labs, and Data Mining practicums.',
        isActive: true
      },
      {
        name: 'Dr. APJ Abdul Kalam Smart Lecture Hall',
        code: 'LH-ENG-301',
        type: 'classroom',
        building: 'Academic Block A',
        floor: '3rd Floor',
        capacity: 120,
        amenities: ['Acoustic Microphones', 'Motorized Smart Screen', 'Lecture Capture Camera', 'Central HVAC'],
        description: 'Tiered amphitheater style smart hall designed for foundational engineering lectures and keynotes.',
        isActive: true
      },
      {
        name: 'Ramanujan Mathematical Science Hall',
        code: 'LH-SCI-102',
        type: 'classroom',
        building: 'Science Block',
        floor: '1st Floor',
        capacity: 80,
        amenities: ['Dual Ceramic Chalkboards', '4K Laser Projector', 'Ergonomic Tiered Seating'],
        description: 'Quiet, acoustically optimized lecture hall for advanced algorithmic and mathematical seminars.',
        isActive: true
      },
      {
        name: 'Sir CV Raman Optics & IoT Lab',
        code: 'LAB-EC-105',
        type: 'laboratory',
        building: 'Bhabha Tech Block',
        floor: '1st Floor',
        capacity: 45,
        amenities: ['Digital Storage Oscilloscopes', 'FPGA Kits', 'RF Spectrum Analyzers', 'IoT Sensor Nodes'],
        description: 'Electronics workbench environment for embedded hardware design and IoT experimentation.',
        isActive: true
      },
      {
        name: 'Vivekananda Grand Auditorium',
        code: 'AUD-MAIN-01',
        type: 'seminar_hall',
        building: 'Central Campus Complex',
        floor: 'Ground Floor',
        capacity: 600,
        amenities: ['Line-Array Surround Audio', 'Broadcast Stage Lighting', 'Green Rooms', 'Dual 300-inch LED Walls'],
        description: 'Premise for inter-college symposiums, national hackathons, and convocations.',
        isActive: true
      }
    ]);

    console.log('[Seeder] Creating upcoming college events...');
    // 4. Create Events
    const now = new Date();
    const event1Date = new Date(now);
    event1Date.setDate(event1Date.getDate() + 7);

    const event2Date = new Date(now);
    event2Date.setDate(event2Date.getDate() + 14);

    const event3Date = new Date(now);
    event3Date.setDate(event3Date.getDate() + 21);

    const events = await Event.create([
      {
        title: 'CampusHacks 2026: 36-Hour National Hackathon',
        description: 'The flagship annual hackathon bringing together 300+ visionary developers, designers, and innovators to build production-grade solutions across AI, Web3, and GreenTech.',
        category: 'hackathon',
        venue: 'Vivekananda Grand Auditorium & Turing Lab',
        resource: resources[0]._id,
        eventDate: event1Date,
        startTime: '09:00',
        endTime: '21:00',
        capacity: 150,
        registeredCount: 3,
        registrationDeadline: new Date(event1Date.getTime() - 24 * 60 * 60 * 1000),
        bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        organizer: adminUser._id,
        tags: ['Hackathon', 'AI', 'FullStack', 'Prizes']
      },
      {
        title: 'Masterclass: LLM Architectures & Production Agents',
        description: 'Deep dive into Transformer internals, RAG retrieval benchmarking, and agentic function calling systems conducted by industry research leads.',
        category: 'workshop',
        venue: 'Ada Lovelace AI & Data Science Lab',
        resource: resources[1]._id,
        eventDate: event2Date,
        startTime: '14:00',
        endTime: '17:30',
        capacity: 50,
        registeredCount: 2,
        registrationDeadline: new Date(event2Date.getTime() - 48 * 60 * 60 * 1000),
        bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        organizer: faculty2._id,
        tags: ['AI', 'LLM', 'HandsOn']
      },
      {
        title: 'CyberDefend: Campus CTF & Ethical Hacking Summit',
        description: 'Capture The Flag cybersecurity competition covering reverse engineering, web exploit defense, and binary inspection under timed conditions.',
        category: 'technical',
        venue: 'Dr. APJ Abdul Kalam Smart Lecture Hall',
        resource: resources[2]._id,
        eventDate: event3Date,
        startTime: '10:00',
        endTime: '16:00',
        capacity: 80,
        registeredCount: 1,
        registrationDeadline: new Date(event3Date.getTime() - 72 * 60 * 60 * 1000),
        bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming',
        organizer: faculty1._id,
        tags: ['Cybersecurity', 'CTF', 'Networking']
      }
    ]);

    console.log('[Seeder] Creating confirmed event registrations & tickets...');
    // 5. Event Registrations
    await EventRegistration.create([
      {
        event: events[0]._id,
        user: student1._id,
        ticketCode: 'CC-HACK-7721',
        status: 'confirmed'
      },
      {
        event: events[0]._id,
        user: student2._id,
        ticketCode: 'CC-HACK-8419',
        status: 'confirmed'
      },
      {
        event: events[0]._id,
        user: student3._id,
        ticketCode: 'CC-HACK-9032',
        status: 'confirmed'
      },
      {
        event: events[1]._id,
        user: student1._id,
        ticketCode: 'CC-AIWS-1044',
        status: 'confirmed'
      },
      {
        event: events[1]._id,
        user: student3._id,
        ticketCode: 'CC-AIWS-2155',
        status: 'confirmed'
      },
      {
        event: events[2]._id,
        user: student2._id,
        ticketCode: 'CC-SEC-4411',
        status: 'confirmed'
      }
    ]);

    console.log('[Seeder] Creating realistic historical & upcoming bookings...');
    // 6. Bookings (Faculty Doubt sessions & Room bookings across statuses)
    const bookingDay1 = new Date(now);
    bookingDay1.setDate(bookingDay1.getDate() + 2);
    bookingDay1.setUTCHours(0, 0, 0, 0);

    const bookingDay2 = new Date(now);
    bookingDay2.setDate(bookingDay2.getDate() + 4);
    bookingDay2.setUTCHours(0, 0, 0, 0);

    const pastDay = new Date(now);
    pastDay.setDate(pastDay.getDate() - 3);
    pastDay.setUTCHours(0, 0, 0, 0);

    await Booking.create([
      // Faculty doubt session - Approved
      {
        bookingType: 'faculty_session',
        requester: student1._id,
        faculty: faculty1._id,
        date: bookingDay1,
        startTime: '10:00',
        endTime: '10:30',
        startMinutes: 600,
        endMinutes: 630,
        durationMinutes: 30,
        subject: 'Distributed Consensus & Raft Algorithm Doubts',
        description: 'Need clarification on leader election split-vote scenarios in Raft protocol for my final year major project.',
        status: 'approved',
        actionedBy: faculty1._id,
        actionedAt: new Date()
      },
      // Faculty doubt session - Pending
      {
        bookingType: 'faculty_session',
        requester: student2._id,
        faculty: faculty1._id,
        date: bookingDay1,
        startTime: '11:00',
        endTime: '11:30',
        startMinutes: 660,
        endMinutes: 690,
        durationMinutes: 30,
        subject: 'Database Sharding & Replication Lag',
        description: 'Seeking guidance on MongoDB replica set failovers and read concern linearizability.',
        status: 'pending'
      },
      // Faculty doubt session with Dr. Patel - Approved
      {
        bookingType: 'faculty_session',
        requester: student3._id,
        faculty: faculty2._id,
        date: bookingDay2,
        startTime: '11:00',
        endTime: '11:30',
        startMinutes: 660,
        endMinutes: 690,
        durationMinutes: 30,
        subject: 'Attention Mechanism & Multi-Head Projections',
        description: 'Mathematical derivation question regarding dot-product scaling factor in self-attention.',
        status: 'approved',
        actionedBy: faculty2._id,
        actionedAt: new Date()
      },
      // Resource booking - Turing Lab Approved
      {
        bookingType: 'resource_booking',
        requester: student1._id,
        resource: resources[0]._id,
        date: bookingDay2,
        startTime: '14:00',
        endTime: '16:00',
        startMinutes: 840,
        endMinutes: 960,
        durationMinutes: 120,
        subject: 'Final Year Capstone Project Team Evaluation',
        description: 'Need Turing Lab GPU workstations for running LLM inference latency benchmarks with 4 project members.',
        status: 'approved',
        actionedBy: adminUser._id,
        actionedAt: new Date()
      },
      // Resource booking - Smart Lecture Hall Pending
      {
        bookingType: 'resource_booking',
        requester: faculty3._id,
        resource: resources[2]._id,
        date: bookingDay1,
        startTime: '15:00',
        endTime: '17:00',
        startMinutes: 900,
        endMinutes: 1020,
        durationMinutes: 120,
        subject: 'Embedded Systems & Drone Telemetry Seminar',
        description: 'Guest lecture by alumni engineer on real-time flight controllers.',
        status: 'pending'
      },
      // Past completed booking
      {
        bookingType: 'resource_booking',
        requester: student2._id,
        resource: resources[1]._id,
        date: pastDay,
        startTime: '10:00',
        endTime: '12:00',
        startMinutes: 600,
        endMinutes: 720,
        durationMinutes: 120,
        subject: 'Open Source Club Hack Sprint',
        description: 'Sprint planning and hands-on PR contributions.',
        status: 'completed',
        actionedBy: adminUser._id,
        actionedAt: pastDay
      }
    ]);

    console.log('[Seeder] Creating in-app notification records...');
    // 7. Notifications
    await Notification.create([
      {
        recipient: student1._id,
        title: 'Booking Approved!',
        message: 'Your doubt session with Dr. Vikram Sharma on Raft Consensus was approved for 10:00 AM.',
        type: 'booking_status',
        actionUrl: '/student/my-bookings',
        isRead: false
      },
      {
        recipient: student1._id,
        title: 'Event Ticket Generated',
        message: 'Your registration for CampusHacks 2026 is confirmed. Ticket: CC-HACK-7721.',
        type: 'event_alert',
        actionUrl: '/student/events',
        isRead: true
      },
      {
        recipient: faculty1._id,
        title: 'New Doubt Request from Riya Sen',
        message: 'Student requested a 30-min slot on Database Sharding & Replication Lag.',
        type: 'session_request',
        actionUrl: '/faculty/requests',
        isRead: false
      },
      {
        recipient: adminUser._id,
        title: 'Resource Request Needs Review',
        message: 'Prof. Sanjay Kulkarni requested Smart Lecture Hall 301 for a Guest Lecture.',
        type: 'system',
        actionUrl: '/admin/bookings',
        isRead: false
      }
    ]);

    console.log('========================================================');
    console.log(' CampusConnect Seed Data Ingestion Completed Successfully!');
    console.log('========================================================');
    console.log(' DEMO CREDENTIALS:');
    console.log('   Admin:   admin@campusconnect.edu     / Admin@123');
    console.log('   Faculty: dr.sharma@campusconnect.edu / Faculty@123');
    console.log('   Faculty: prof.patel@campusconnect.edu / Faculty@123');
    console.log('   Student: aarav.student@campusconnect.edu / Student@123');
    console.log('   Student: riya.student@campusconnect.edu  / Student@123');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Ingestion failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();

