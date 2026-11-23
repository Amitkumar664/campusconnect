const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const QRCode = require('qrcode');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing obsolete records...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Booking.deleteMany({}),
      Team.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('[Seeder] Creating realistic campus users (Strictly Admin and Student)...');

    // 1. Admin
    const adminUser = await User.create({
      fullName: 'Dr. Rajeshwar Rao',
      email: 'admin@campusconnect.edu',
      password: 'Admin@123',
      role: 'admin',
      department: 'Central Student Affairs & Administration',
      studentOrEmployeeId: 'ADM-2026-001',
      phone: '+91 98765 00001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    // 2. Students
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
      studentOrEmployeeId: 'STU-2023-IT-018',
      phone: '+91 98765 22002',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    const student3 = await User.create({
      fullName: 'Kunal Verma',
      email: 'kunal.student@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Mechanical Engineering',
      studentOrEmployeeId: 'STU-2024-ME-055',
      phone: '+91 98765 22003',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    const student4 = await User.create({
      fullName: 'Sneha Kulkarni',
      email: 'sneha.student@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Electronics & Communication',
      studentOrEmployeeId: 'STU-2023-EC-089',
      phone: '+91 98765 22004',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      isActive: true
    });

    console.log('[Seeder] Creating rich collegiate events (Hackathons, Sports, Virtual, Cultural)...');

    const now = new Date();

    // 1. Hackathon Event
    const hackathonDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const hackathonDeadline = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const hackathon = await Event.create({
      title: 'HackNova 2026: Campus AI & Web3 Hackathon',
      description: 'The flagship annual 36-hour hackathon bringing together over 300 passionate campus developers to build disruptive solutions across Generative AI, Sustainable Tech, and Decentralized Networks.',
      category: 'hackathon',
      eventType: 'hackathon',
      venue: 'Dr. APJ Abdul Kalam Innovation Centre & High-Performance Lab',
      eventDate: hackathonDate,
      startTime: '09:00',
      endTime: '21:00',
      capacity: 120,
      registeredCount: 88,
      registrationStartDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      registrationDeadline: hackathonDeadline,
      ticketPrice: 0,
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      status: 'filling_fast',
      organizer: adminUser._id,
      organizerName: 'Turing Computing Society',
      tags: ['Hackathon', 'AI', 'Coding', 'Web3', 'Prizes'],
      minTeamSize: 2,
      maxTeamSize: 4,
      problemStatement: 'Track 1: Real-time Campus Resource Optimization using Machine Learning\nTrack 2: Decentralized Student Identity & Verifiable Credentials\nTrack 3: Climate Action and Campus Energy Footprint Reduction',
      submissionDeadline: new Date(hackathonDate.getTime() + 36 * 60 * 60 * 1000),
      submissionInstructions: 'Submit a public GitHub repository link with a working README, architecture diagram, and an unlisted 3-minute YouTube or Loom demo video.',
      prizes: [
        { title: '1st Place Winner', reward: '₹50,000 Cash + Cloud Credits + Trophy', description: 'Best overall innovation and engineering rigor' },
        { title: '1st Runner Up', reward: '₹25,000 Cash + Swag Box', description: 'Strongest execution and real-world viability' },
        { title: 'Best AI Track Solution', reward: '₹15,000 Special Recognition', description: 'Awarded to top generative AI model implementation' }
      ]
    });

    // 2. Sports Event (Cricket)
    const cricketDate = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
    const cricketEvent = await Event.create({
      title: 'Inter-Department Cricket Premier Cup 2026',
      description: 'The electrifying annual T10 cricket clash between engineering departments. 8 departments battle for campus bragging rights and the championship trophy.',
      category: 'sports',
      eventType: 'sports',
      venue: 'Main University Cricket Stadium (Pavilion Ground)',
      eventDate: cricketDate,
      startTime: '08:30',
      endTime: '17:30',
      capacity: 250,
      registeredCount: 160,
      registrationStartDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      ticketPrice: 0,
      bannerUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
      status: 'open',
      organizer: adminUser._id,
      organizerName: 'Campus Sports Board',
      sportType: 'Cricket',
      tournamentFormat: 'Knockout',
      matchSchedule: [
        { matchNumber: 1, round: 'Quarterfinal 1', team1: 'CSE Strikers', team2: 'ECE Dynamos', matchTime: '09:00 AM', courtOrField: 'Pitch A', score: 'CSE 112/4 (10 ov) vs ECE 98/7', winner: 'CSE Strikers', status: 'completed' },
        { matchNumber: 2, round: 'Quarterfinal 2', team1: 'Mechanical Warriors', team2: 'Civil Titans', matchTime: '11:30 AM', courtOrField: 'Pitch A', score: '', winner: '', status: 'scheduled' },
        { matchNumber: 3, round: 'Semifinal 1', team1: 'CSE Strikers', team2: 'TBD', matchTime: '02:00 PM', courtOrField: 'Pitch A', score: '', winner: '', status: 'scheduled' },
        { matchNumber: 4, round: 'Grand Final', team1: 'TBD', team2: 'TBD', matchTime: '04:30 PM', courtOrField: 'Pavilion Turf', score: '', winner: '', status: 'scheduled' }
      ]
    });

    // 3. Virtual Webinar Event
    const webinarDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const webinar = await Event.create({
      title: 'Global Engineering Keynote: Scaling Distributed Systems to 10M QPS',
      description: 'Exclusive fireside masterclass with ex-Google Principal Architect exploring resilient distributed pipelines, Raft consensus, and high-throughput microservices.',
      category: 'webinar',
      eventType: 'virtual',
      venue: 'Google Meet (Virtual Conference Room)',
      isVirtual: true,
      platform: 'Google Meet',
      virtualMeetingUrl: 'https://meet.google.com/xyz-camp-2026',
      eventDate: webinarDate,
      startTime: '18:00',
      endTime: '20:00',
      capacity: 300,
      registeredCount: 285,
      registrationStartDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      ticketPrice: 0,
      bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      status: 'filling_fast',
      organizer: adminUser._id,
      organizerName: 'IEEE Student Branch',
      tags: ['Cloud', 'Systems', 'Virtual', 'Webinar']
    });

    // 4. Cultural Festival
    const festivalDate = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);
    const festival = await Event.create({
      title: 'RHYTHM 2026: Annual Inter-College Cultural Extravaganza',
      description: 'Three nights of high-octane music, dance battles, dramatics, battle of the bands, celebrity artist concert, and food stalls.',
      category: 'festival',
      eventType: 'general',
      venue: 'Main Open Air Theatre (OAT) & Campus Amphitheatre',
      eventDate: festivalDate,
      startTime: '16:00',
      endTime: '23:00',
      capacity: 800,
      registeredCount: 540,
      registrationStartDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      ticketPrice: 150,
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      status: 'open',
      organizer: adminUser._id,
      organizerName: 'Student Cultural Council',
      tags: ['Music', 'Dance', 'Concert', 'Festival']
    });

    // 5. Technical Workshop
    const workshopDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const workshop = await Event.create({
      title: 'Hands-On Workshop: Deep Learning with PyTorch & HuggingFace',
      description: 'Intensive laboratory session training fine-tuned transformer models and deploying quantized inferences on edge GPUs.',
      category: 'workshop',
      eventType: 'general',
      venue: 'Alan Turing Advanced Computing Lab, Room 302',
      eventDate: workshopDate,
      startTime: '10:00',
      endTime: '16:00',
      capacity: 45,
      registeredCount: 45,
      registrationStartDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      ticketPrice: 0,
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      status: 'sold_out',
      organizer: adminUser._id,
      organizerName: 'Data Science Club'
    });

    console.log('[Seeder] Creating teams for HackNova and Sports...');

    // Team for Aarav & Riya in HackNova
    const hackTeam = await Team.create({
      teamName: 'NeuralKnights',
      event: hackathon._id,
      leader: student1._id,
      teamCode: 'TEAM-NK88',
      maxMembers: 4,
      members: [
        { user: student1._id, role: 'leader', joinedAt: new Date() },
        { user: student2._id, role: 'member', joinedAt: new Date() }
      ],
      projectSubmission: {
        title: 'CampuSync - Automated Sensor Grid Analytics',
        repoUrl: 'https://github.com/campusconnect/campusync-ml',
        demoUrl: 'https://campusync-demo.vercel.app',
        description: 'IoT Edge energy anomaly detection using TinyML',
        submittedAt: new Date()
      },
      status: 'submitted'
    });

    console.log('[Seeder] Generating valid digital tickets with QR codes...');

    // Generate QR for Aarav's hackathon ticket
    const qrPayloadAarav = JSON.stringify({
      bookingId: 'BK-58291',
      ticketCode: 'CC-TKT-HACK01',
      eventId: hackathon._id.toString(),
      eventTitle: hackathon.title,
      studentName: student1.fullName,
      studentId: student1.studentOrEmployeeId
    });

    const qrDataUrlAarav = await QRCode.toDataURL(qrPayloadAarav, {
      margin: 2,
      width: 280,
      color: { dark: '#0F172A', light: '#FFFFFF' }
    });

    const booking1 = await Booking.create({
      bookingId: 'BK-58291',
      ticketCode: 'CC-TKT-HACK01',
      event: hackathon._id,
      user: student1._id,
      registrationType: 'team',
      team: hackTeam._id,
      qrCode: qrDataUrlAarav,
      ticketPrice: 0,
      paymentStatus: 'free',
      status: 'confirmed',
      checkInStatus: 'unattended',
      attendeeDetails: {
        fullName: student1.fullName,
        email: student1.email,
        studentOrEmployeeId: student1.studentOrEmployeeId,
        department: student1.department,
        phone: student1.phone
      }
    });

    // Aarav's ticket for the virtual webinar
    const qrPayloadAaravWebinar = JSON.stringify({
      bookingId: 'BK-77412',
      ticketCode: 'CC-TKT-WEB02',
      eventId: webinar._id.toString(),
      eventTitle: webinar.title,
      studentName: student1.fullName,
      studentId: student1.studentOrEmployeeId
    });

    const qrDataUrlWebinar = await QRCode.toDataURL(qrPayloadAaravWebinar, {
      margin: 2,
      width: 280,
      color: { dark: '#0F172A', light: '#FFFFFF' }
    });

    const booking2 = await Booking.create({
      bookingId: 'BK-77412',
      ticketCode: 'CC-TKT-WEB02',
      event: webinar._id,
      user: student1._id,
      registrationType: 'individual',
      qrCode: qrDataUrlWebinar,
      ticketPrice: 0,
      paymentStatus: 'free',
      status: 'confirmed',
      checkInStatus: 'checked_in', // Already checked in to test Door Check-in UI
      checkedInAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      checkedInBy: adminUser._id,
      attendeeDetails: {
        fullName: student1.fullName,
        email: student1.email,
        studentOrEmployeeId: student1.studentOrEmployeeId,
        department: student1.department,
        phone: student1.phone
      }
    });

    // Riya's ticket for cricket
    const qrPayloadRiya = JSON.stringify({
      bookingId: 'BK-33910',
      ticketCode: 'CC-TKT-SPT03',
      eventId: cricketEvent._id.toString(),
      eventTitle: cricketEvent.title,
      studentName: student2.fullName,
      studentId: student2.studentOrEmployeeId
    });

    const qrDataUrlRiya = await QRCode.toDataURL(qrPayloadRiya, {
      margin: 2,
      width: 280,
      color: { dark: '#0F172A', light: '#FFFFFF' }
    });

    await Booking.create({
      bookingId: 'BK-33910',
      ticketCode: 'CC-TKT-SPT03',
      event: cricketEvent._id,
      user: student2._id,
      registrationType: 'individual',
      qrCode: qrDataUrlRiya,
      ticketPrice: 0,
      paymentStatus: 'free',
      status: 'confirmed',
      checkInStatus: 'unattended',
      attendeeDetails: {
        fullName: student2.fullName,
        email: student2.email,
        studentOrEmployeeId: student2.studentOrEmployeeId,
        department: student2.department,
        phone: student2.phone
      }
    });

    console.log('[Seeder] Creating notifications...');
    await Notification.create({
      recipient: student1._id,
      title: 'Digital Pass Issued: HackNova 2026',
      message: 'Your team "NeuralKnights" is confirmed. Your unique ticket code is CC-TKT-HACK01.',
      type: 'event',
      actionUrl: '/student/my-tickets'
    });

    await Notification.create({
      recipient: student1._id,
      title: 'Webinar Starting Soon',
      message: 'Scaling Distributed Systems masterclass begins in 2 days. Access your private Google Meet link in the portal.',
      type: 'reminder',
      actionUrl: '/student/virtual-events'
    });

    console.log('[Seeder] CampusConnect database successfully primed with 2.0 modernized schema!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedData();
