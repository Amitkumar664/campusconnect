import React, { useState, useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Check,
  Star,
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Trophy,
  Users,
  Code2,
  Tv,
  QrCode,
  Ticket,
  ChevronDown,
  ChevronUp,
  Flame,
  Globe,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();

  // If already authenticated, redirect to corresponding dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  // --- Live Countdown Timer State (Matches the 140 00 29 57 counter in CONFERIO screenshot) ---
  const [timeLeft, setTimeLeft] = useState({
    days: 140,
    hours: 12,
    mins: 29,
    secs: 57
  });

  useEffect(() => {
    // Target date set to an upcoming flagship festival date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 140);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days < 10 ? `0${days}` : days,
          hours: hours < 10 ? `0${hours}` : hours,
          mins: mins < 10 ? `0${mins}` : mins,
          secs: secs < 10 ? `0${secs}` : secs
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- Interactive Door Check-in Desk State (Hi.events front door view) ---
  const [attendees, setAttendees] = useState([
    { id: '1', name: 'Aoife Brennan', code: 'A-06FNGUA', type: 'General admit', checkedIn: true },
    { id: '2', name: 'Marcus Whitfield', code: 'A-00XJQ8U', type: 'General admit', checkedIn: true },
    { id: '3', name: 'Priya Raghunathan', code: 'A-JVXNJAB', type: 'Research Lead', checkedIn: true },
    { id: '4', name: 'Tomás Ferreira', code: 'A-2DJDXV2', type: 'General admit', checkedIn: false },
    { id: '5', name: 'Hannah Okonkwo', code: 'A-89KLP12', type: 'Hackathon VIP', checkedIn: false },
    { id: '6', name: 'Arjun Mehta', code: 'A-77PLQ99', type: 'AI Station 4', checkedIn: false }
  ]);
  const [doorSearch, setDoorSearch] = useState('');
  const [doorFilter, setDoorFilter] = useState('all'); // all, remaining, checked_in

  const toggleCheckIn = (id) => {
    setAttendees((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checkedIn: !item.checkedIn } : item
      )
    );
  };

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const remainingCount = attendees.length - checkedInCount;

  const filteredAttendees = useMemo(() => {
    return attendees.filter((a) => {
      const match =
        a.name.toLowerCase().includes(doorSearch.toLowerCase()) ||
        a.code.toLowerCase().includes(doorSearch.toLowerCase()) ||
        a.type.toLowerCase().includes(doorSearch.toLowerCase());
      if (!match) return false;
      if (doorFilter === 'remaining') return !a.checkedIn;
      if (doorFilter === 'checked_in') return a.checkedIn;
      return true;
    });
  }, [attendees, doorSearch, doorFilter]);

  // --- Date Tabs State for Schedule Section ---
  const [activeDateTab, setActiveDateTab] = useState('24_nov');

  const scheduleData = {
    '24_nov': [
      {
        time: '09:00 AM - 10:30 AM',
        title: 'Grand Keynote: Generative AI on Campus',
        track: 'Technical',
        speaker: 'Dr. Sarah Mitchell · Google Cloud',
        venue: 'Main Auditorium',
        seats: 'Available'
      },
      {
        time: '11:00 AM - 01:00 PM',
        title: '48-Hour National Collegiate Hackathon Kickoff',
        track: 'Hackathon',
        speaker: 'Campus Hackathon Council',
        venue: 'Turing Innovation Lab',
        seats: 'Filling Fast'
      },
      {
        time: '02:30 PM - 05:00 PM',
        title: 'Inter-College Football Premier Cup Match 1',
        track: 'Sports',
        speaker: 'Sports Directorate',
        venue: 'University Stadium',
        seats: 'Open'
      }
    ],
    '25_nov': [
      {
        time: '10:00 AM - 12:00 PM',
        title: 'Cloud DevOps & Kubernetes Hands-On Workshop',
        track: 'Workshop',
        speaker: 'Alexandre Roy · RedHat Architect',
        venue: 'Virtual Classroom 1',
        seats: 'Available'
      },
      {
        time: '01:30 PM - 04:00 PM',
        title: 'RoboWars & Hardware Drone Challenge',
        track: 'Competition',
        speaker: 'Robotics Society',
        venue: 'Engineering Quad',
        seats: 'Filling Fast'
      },
      {
        time: '05:30 PM - 08:30 PM',
        title: 'Annual Cultural Night: Symphony Under The Stars',
        track: 'Cultural',
        speaker: 'Performing Arts Guild',
        venue: 'Open Air Amphitheatre',
        seats: 'Almost Full'
      }
    ],
    '26_nov': [
      {
        time: '10:00 AM - 01:00 PM',
        title: 'Hackathon Grand Jury Pitches & Demo Day',
        track: 'Hackathon',
        speaker: 'VC & Alumni Jury Board',
        venue: 'Tech Auditorium',
        seats: 'Open'
      },
      {
        time: '02:00 PM - 04:30 PM',
        title: 'Inter-College Basketball Championship Finals',
        track: 'Sports',
        speaker: 'Campus Athletics Council',
        venue: 'Indoor Sports Complex',
        seats: 'Filling Fast'
      },
      {
        time: '05:00 PM - 07:00 PM',
        title: 'Felicitation & ₹10,00,000 Award Gala',
        track: 'Closing Gala',
        speaker: 'Chancellor & Guest Dignitaries',
        venue: 'Grand Convocation Hall',
        seats: 'VIP Reserved'
      }
    ]
  };

  // --- FAQ State ---
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    {
      q: 'How does digital ticket booking and QR verification work?',
      a: 'When you register for an event, CampusConnect atomically reserves your seat and generates an encrypted digital QR pass. At the venue door, staff scan the QR or search your ticket code on the live door app to check you in with 0 duplication.'
    },
    {
      q: 'Can students register individually or as teams for hackathons?',
      a: 'Both! You can register as a solo developer or create a squad with a unique 6-character team code (e.g., TEAM-NK88) to invite fellow students.'
    },
    {
      q: 'Are sports tournaments and live fixtures updated in real time?',
      a: 'Yes. Administrators publish match schedules, and scores update live on the student sports hub with round brackets and tournament winners.'
    },
    {
      q: 'How does AI-powered analytics help administrators?',
      a: 'The platform integrates Python Scikit-Learn machine learning to forecast upcoming event turnout based on category, timing, and historical velocity — completely eliminating guesswork.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#111111] font-sans selection:bg-[#FFE600] selection:text-black overflow-x-hidden">
      
      {/* ========================================================
          1. TOP BLACK MARQUEE TICKER (from CONFERIO reference)
         ======================================================== */}
      <div className="bg-black text-white text-[11px] font-mono font-bold tracking-widest uppercase py-2.5 px-4 overflow-hidden border-b border-black">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <span>THE 2026 CAMPUS FESTIVAL</span>
          <span className="text-[#FFE600]">★</span>
          <span>GRAVITY HAS NO LIMITS HERE</span>
          <span className="text-[#FFE600]">★</span>
          <span>FEEL THE THRILL • LIVE THE STUNT</span>
          <span className="text-[#FFE600]">★</span>
          <span>LEARN & WIN PRIZES</span>
          <span className="text-[#FFE600]">★</span>
          <span>JOIN THE ADVENTURE ON TWO WHEELS & CODE</span>
          <span className="text-[#FFE600]">★</span>
          <span>100+ EVENTS & HACKATHONS</span>
          <span className="text-[#FFE600]">★</span>
          <span>ATOMIC QR TICKETING & DOOR VERIFICATION</span>
          <span className="text-[#FFE600]">★</span>
          <span>AI-POWERED PREDICTOR</span>
        </div>
      </div>

      {/* ========================================================
          2. ACID YELLOW HERO & NAVBAR (Matches CONFERIO screenshot)
         ======================================================== */}
      <section className="bg-[#F5DF4D] relative border-b-4 border-black pb-36 pt-4 px-4 sm:px-8 overflow-hidden">
        {/* Playful Floating Stickers & Retro Doodles */}
        {/* Blue 4-point star on the left */}
        <div className="absolute top-28 left-6 sm:left-16 pointer-events-none select-none z-10 hidden sm:block">
          <svg className="w-16 h-16 text-[#67C7FA] drop-shadow-[2px_2px_0px_#000]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 L58 38 L96 46 L58 54 L50 92 L42 54 L4 46 L42 38 Z" stroke="#000" strokeWidth="4" />
          </svg>
        </div>

        {/* Tilted location/date ribbon sticker */}
        <div className="absolute top-44 left-10 sm:left-24 -rotate-12 z-20 hidden md:block">
          <div className="bg-[#E9D5FF] text-black border-2 border-black font-mono font-black text-xs px-3.5 py-1.5 shadow-[3px_3px_0px_#000] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-black" />
            <span>CAMPUS ARENA · 24-26 NOV 2026</span>
          </div>
        </div>

        {/* Pink/Lavender Circular Spinning Badge on the right */}
        <div className="absolute top-28 right-8 sm:right-20 pointer-events-none select-none z-10 hidden sm:block">
          <div className="w-24 h-24 rounded-full bg-[#E9D5FF] border-2 border-black flex items-center justify-center p-2 shadow-[4px_4px_0px_#000] text-center rotate-6">
            <span className="font-mono text-[9px] font-black tracking-tight text-black leading-tight uppercase">
              ★ CAMPUSCONNECT ★<br />2026 EDITION<br />CREATIVITY
            </span>
          </div>
        </div>

        {/* Hand-drawn star outline doodle */}
        <div className="absolute bottom-40 right-14 sm:right-32 pointer-events-none select-none z-10 hidden lg:block">
          <svg className="w-20 h-20 text-black rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M50 5 L63 35 L95 38 L70 60 L78 92 L50 75 L22 92 L30 60 L5 38 L37 35 Z" />
          </svg>
        </div>

        {/* --- Top Navigation Bar --- */}
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 border-b-2 border-black mb-12 sm:mb-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display font-black text-2xl sm:text-3xl text-black tracking-tighter uppercase drop-shadow-[1px_1px_0px_#FFF]">
              CONFERIO<span className="text-[#387ED1]">.CC</span>
            </span>
          </Link>

          {/* Center Links (CONFERIO style: HOME +, EVENTS +, PAGES +, CONTACT) */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-mono font-extrabold text-black uppercase tracking-wider">
            <a href="#events" className="hover:underline flex items-center gap-1">
              Events +
            </a>
            <a href="#schedule" className="hover:underline flex items-center gap-1">
              Schedule +
            </a>
            <a href="#tickets" className="hover:underline flex items-center gap-1">
              Tickets +
            </a>
            <a href="#door-app" className="hover:underline flex items-center gap-1">
              Door App +
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-mono font-bold text-black hover:bg-black hover:text-white rounded-lg transition-all border-2 border-transparent hover:border-black"
            >
              SIGN IN
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-black text-white text-xs font-mono font-black uppercase tracking-wider rounded-lg border-2 border-black shadow-[3px_3px_0px_#FFF] hover:shadow-[1px_1px_0px_#FFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <span>BUY TICKET</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>

        {/* --- Hero Content Area --- */}
        <div className="max-w-5xl mx-auto text-center relative z-20">
          {/* Cyan Pill Tag */}
          <div className="inline-block mb-4">
            <div className="bg-[#BAE6FD] text-black border-2 border-black font-mono font-black text-[11px] uppercase tracking-widest px-4 py-1.5 shadow-[3px_3px_0px_#000] rounded-sm">
              COLLEGIATE EVENT 2026
            </div>
          </div>

          {/* Giant Title (Matches CONFERIO: INNOVATORS CONNECT EVENT LIVE) */}
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-black tracking-tighter leading-[0.92] uppercase mb-8">
            INNOVATORS<br />
            CONNECT EVENT<br />
            LIVE
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#BAE6FD] text-black font-mono font-black text-sm uppercase tracking-wider border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center gap-2.5"
            >
              <span>BOOK YOUR SEAT</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <a
              href="#schedule"
              className="px-6 py-3.5 bg-white text-black font-mono font-bold text-sm uppercase tracking-wider border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:bg-slate-100 transition-all"
            >
              EXPLORE SCHEDULE
            </a>
          </div>

          {/* --- Live Countdown Timer (Matches: 140 DAYS  00 HRS  29 MINS  57 SECS) --- */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="grid grid-cols-4 gap-2 sm:gap-6 text-center">
              <div>
                <div className="font-display font-black text-4xl sm:text-6xl text-black tracking-tight leading-none">
                  {timeLeft.days}
                </div>
                <div className="font-mono text-[10px] sm:text-xs font-bold text-black/70 tracking-widest uppercase mt-2">
                  DAYS
                </div>
              </div>
              <div>
                <div className="font-display font-black text-4xl sm:text-6xl text-black tracking-tight leading-none">
                  {timeLeft.hours}
                </div>
                <div className="font-mono text-[10px] sm:text-xs font-bold text-black/70 tracking-widest uppercase mt-2">
                  HRS
                </div>
              </div>
              <div>
                <div className="font-display font-black text-4xl sm:text-6xl text-black tracking-tight leading-none">
                  {timeLeft.mins}
                </div>
                <div className="font-mono text-[10px] sm:text-xs font-bold text-black/70 tracking-widest uppercase mt-2">
                  MINS
                </div>
              </div>
              <div>
                <div className="font-display font-black text-4xl sm:text-6xl text-black tracking-tight leading-none">
                  {timeLeft.secs}
                </div>
                <div className="font-mono text-[10px] sm:text-xs font-bold text-black/70 tracking-widest uppercase mt-2">
                  SECS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Overlapping Polaroid / Photo Strip (Hanging into the black section) --- */}
        <div className="max-w-6xl mx-auto mt-16 sm:mt-20 relative z-30 -mb-56">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
            {/* Photo 1: Cheering Audience */}
            <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-2.5 pb-4 border-2 border-black shadow-[6px_6px_0px_#000] rounded-sm">
                <div className="aspect-[4/5] overflow-hidden bg-slate-200 border border-black">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                    alt="Audience clapping"
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="font-mono text-[10px] font-bold text-black mt-2 text-center uppercase tracking-wider">
                  ★ Keynote Grand Hall
                </div>
              </div>
            </div>

            {/* Photo 2: Student Speaker */}
            <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300 translate-y-4">
              <div className="bg-white p-2.5 pb-4 border-2 border-black shadow-[6px_6px_0px_#000] rounded-sm">
                <div className="aspect-[4/5] overflow-hidden bg-slate-200 border border-black">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
                    alt="Student presenting"
                    className="w-full h-full object-cover contrast-125"
                  />
                </div>
                <div className="font-mono text-[10px] font-bold text-black mt-2 text-center uppercase tracking-wider">
                  ★ Stage Pitch 2026
                </div>
              </div>
            </div>

            {/* Photo 3: Hackathon Team */}
            <div className="transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-2.5 pb-4 border-2 border-black shadow-[6px_6px_0px_#000] rounded-sm">
                <div className="aspect-[4/5] overflow-hidden bg-slate-200 border border-black">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Hackathon team coding"
                    className="w-full h-full object-cover contrast-125"
                  />
                </div>
                <div className="font-mono text-[10px] font-bold text-black mt-2 text-center uppercase tracking-wider">
                  ★ 48hr HackNova Squad
                </div>
              </div>
            </div>

            {/* Photo 4: Keynote Presentation */}
            <div className="transform rotate-2 hover:rotate-0 transition-transform duration-300 translate-y-3">
              <div className="bg-white p-2.5 pb-4 border-2 border-black shadow-[6px_6px_0px_#000] rounded-sm">
                <div className="aspect-[4/5] overflow-hidden bg-slate-200 border border-black">
                  <img
                    src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"
                    alt="Keynote presentation"
                    className="w-full h-full object-cover contrast-125"
                  />
                </div>
                <div className="font-mono text-[10px] font-bold text-black mt-2 text-center uppercase tracking-wider">
                  ★ Tech Founder Talk
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. PITCH BLACK MIDDLE SECTION (from CONFERIO reference)
         ======================================================== */}
      <section id="about" className="bg-[#111111] text-white pt-64 pb-28 px-4 sm:px-8 border-b-4 border-black relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Slanted Tape Stickers */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#F5DF4D] text-black font-mono font-black text-xs px-3.5 py-1 -rotate-3 border border-black shadow-[2px_2px_0px_#FFF]">
              ABOUT US
            </div>
            <div className="bg-[#E9D5FF] text-black font-mono font-black text-xs px-3.5 py-1 rotate-2 border border-black shadow-[2px_2px_0px_#FFF]">
              LIVE EVENT
            </div>
          </div>

          {/* Big Bold Headline */}
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-[1.08] max-w-4xl mb-14">
            WE BELIEVE THAT EVERY CAMPUS EVENT SHOULD BE MORE THAN JUST AN OCCASION.
          </h2>

          {/* 4-Column Atmospheric Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-[4/3] rounded-none border-2 border-[#333] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
                alt="Audience cheering"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-none border-2 border-[#333] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-none border-2 border-[#333] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Speaker with microphone"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-none border-2 border-[#333] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80"
                alt="Student networking"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. BIG IMPACT NUMBERS COUNTER GRID (from right scroll)
         ======================================================== */}
      <section className="bg-white text-black py-16 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            <div className="pt-4 md:pt-0">
              <div className="font-display font-black text-4xl sm:text-5xl text-black">20+</div>
              <div className="font-mono text-xs font-bold uppercase text-slate-600 mt-1">Categories</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-display font-black text-4xl sm:text-5xl text-black">100+</div>
              <div className="font-mono text-xs font-bold uppercase text-slate-600 mt-1">Events Hosted</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-display font-black text-4xl sm:text-5xl text-black">5K+</div>
              <div className="font-mono text-xs font-bold uppercase text-slate-600 mt-1">Active Students</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-display font-black text-4xl sm:text-5xl text-black">30+</div>
              <div className="font-mono text-xs font-bold uppercase text-slate-600 mt-1">Collegiate Sponsors</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-display font-black text-4xl sm:text-5xl text-black">₹10L+</div>
              <div className="font-mono text-xs font-bold uppercase text-slate-600 mt-1">Grants & Prizes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SCHEDULE & DATE TABS SECTION (from CONFERIO reference)
         ======================================================== */}
      <section id="schedule" className="bg-[#FAF8F5] text-black py-24 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#F5DF4D] text-black font-mono font-black text-[11px] px-3 py-1 border border-black shadow-[2px_2px_0px_#000]">
                ANNUAL EVENT
              </div>
              <div className="bg-[#E9D5FF] text-black font-mono font-black text-[11px] px-3 py-1 border border-black shadow-[2px_2px_0px_#000]">
                DAY-BY-DAY AGENDA
              </div>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-black tracking-tight uppercase max-w-2xl">
              JOIN US FOR EVENTS THAT INSPIRE, CONNECT AND CELEBRATE.
            </h2>
          </div>

          {/* Date Filter Tabs (Matches: 22 JAN 2026, 23 JAN 2026, 24 JAN 2026) */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {[
              { id: '24_nov', label: '24 NOV 2026 · DAY 01' },
              { id: '25_nov', label: '25 NOV 2026 · DAY 02' },
              { id: '26_nov', label: '26 NOV 2026 · DAY 03' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDateTab(tab.id)}
                className={`px-5 py-2.5 font-mono text-xs font-black uppercase rounded-lg border-2 border-black transition-all cursor-pointer ${
                  activeDateTab === tab.id
                    ? 'bg-black text-white shadow-[4px_4px_0px_#F5DF4D]'
                    : 'bg-white text-black hover:bg-slate-100 shadow-[3px_3px_0px_#000]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Schedule List Cards */}
          <div className="space-y-4">
            {scheduleData[activeDateTab].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border-2 border-black shadow-[5px_5px_0px_#000] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:translate-x-1 transition-transform"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="font-mono text-xs font-black text-[#387ED1] bg-[#387ED1]/10 px-3 py-1.5 rounded border border-[#387ED1]/30 self-start">
                    {item.time}
                  </div>
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 border border-slate-300 text-slate-800 mb-1">
                      {item.track}
                    </div>
                    <h3 className="font-display font-black text-lg sm:text-xl text-black">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-slate-600 mt-0.5">
                      {item.speaker} · <span className="font-bold text-black">{item.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                    {item.seats}
                  </span>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-black text-white font-mono text-xs font-bold uppercase rounded border border-black hover:bg-[#387ED1] transition-colors flex items-center gap-1.5"
                  >
                    <span>Reserve</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. TICKET PRICING TIERS (from CONFERIO right scroll)
         ======================================================== */}
      <section id="tickets" className="bg-[#111111] text-white py-24 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block bg-[#F5DF4D] text-black font-mono font-black text-xs px-4 py-1 border border-black shadow-[3px_3px_0px_#FFF] mb-3">
              TICKETS & ADMISSION
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              CHOOSE YOUR ADMISSION PASS
            </h2>
            <p className="font-mono text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2">
              Every pass includes atomic seat allocation, a unique digital QR pass, and access to all published competition tracks.
            </p>
          </div>

          {/* 3 Neo-Brutalist Ticket Cards with Colorful Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Student Free Pass */}
            <div className="bg-white text-black border-4 border-black shadow-[8px_8px_0px_#F5DF4D] rounded-none flex flex-col justify-between overflow-hidden">
              <div>
                <div className="bg-[#E9D5FF] p-6 border-b-4 border-black">
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-black">
                    STUDENT DELEGATE
                  </div>
                  <div className="font-display font-black text-4xl text-black mt-2">
                    FREE <span className="text-xs font-mono font-normal text-slate-700">/ 0 INR</span>
                  </div>
                  <p className="font-mono text-xs text-black/80 mt-1">
                    Standard admission for all enrolled campus students.
                  </p>
                </div>
                <div className="p-6 space-y-3 font-mono text-xs text-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Access to technical & cultural keynotes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Digital QR code mobile gate pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Live sports tournament spectator access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Digital certificate of participation</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/register"
                  className="w-full py-3 bg-black hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider text-center block border-2 border-black transition-colors"
                >
                  GET STUDENT PASS →
                </Link>
              </div>
            </div>

            {/* Card 2: Hackathon Squad Pass (Most Popular) */}
            <div className="bg-white text-black border-4 border-black shadow-[8px_8px_0px_#000] rounded-none flex flex-col justify-between overflow-hidden transform md:-translate-y-4">
              <div>
                <div className="bg-black text-white p-6 border-b-4 border-black relative">
                  <div className="absolute top-3 right-3 bg-[#F5DF4D] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black uppercase">
                    POPULAR
                  </div>
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-[#F5DF4D]">
                    HACKATHON SQUAD
                  </div>
                  <div className="font-display font-black text-4xl text-white mt-2">
                    PASS <span className="text-xs font-mono font-normal text-slate-400">/ 4-Member Squad</span>
                  </div>
                  <p className="font-mono text-xs text-slate-300 mt-1">
                    Full 48hr hackathon squad entry with lab access.
                  </p>
                </div>
                <div className="p-6 space-y-3 font-mono text-xs text-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Full 48-Hour Hackathon lab station</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Unique 6-char team code (e.g. TEAM-NK88)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>High-speed Gigabit lab network & cloud credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Eligible for ₹5,00,000 jury cash prizes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Mentor sessions & code reviews</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/register"
                  className="w-full py-3 bg-[#F5DF4D] hover:bg-[#FFE600] text-black font-mono font-black text-xs uppercase tracking-wider text-center block border-2 border-black shadow-[3px_3px_0px_#000] transition-colors"
                >
                  REGISTER SQUAD →
                </Link>
              </div>
            </div>

            {/* Card 3: VIP All-Access Pass */}
            <div className="bg-white text-black border-4 border-black shadow-[8px_8px_0px_#67C7FA] rounded-none flex flex-col justify-between overflow-hidden">
              <div>
                <div className="bg-[#BAE6FD] p-6 border-b-4 border-black">
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-black">
                    VIP ALL-ACCESS
                  </div>
                  <div className="font-display font-black text-4xl text-black mt-2">
                    ALL-PASS <span className="text-xs font-mono font-normal text-slate-700">/ Priority</span>
                  </div>
                  <p className="font-mono text-xs text-black/80 mt-1">
                    Front row reserved seating and priority door lane.
                  </p>
                </div>
                <div className="p-6 space-y-3 font-mono text-xs text-slate-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Front-row reserved seating in keynotes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Express priority door check-in lane</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Exclusive networking dinner with speakers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>CampusConnect 2026 official delegate swag</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/register"
                  className="w-full py-3 bg-black hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider text-center block border-2 border-black transition-colors"
                >
                  GET VIP PASS →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FRONT DOOR CHECK-IN APP SIMULATOR (Hi.events style)
         ======================================================== */}
      <section id="door-app" className="bg-[#FAF8F5] text-black py-24 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#F5DF4D] text-black font-mono font-black text-xs px-3.5 py-1 border border-black shadow-[2px_2px_0px_#000] inline-block">
                AT THE ENTRANCE GATE
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-black tracking-tight uppercase leading-tight">
                WHAT YOUR DOOR STAFF ACTUALLY SEE
              </h2>
              <p className="font-mono text-xs sm:text-sm text-slate-700 leading-relaxed">
                You send your volunteer staff a link and that is the whole setup — no install, no account, no seat to pay for.
                Camera scan, barcode scanner, or search a student name and tap.
              </p>

              <div className="space-y-3 font-mono text-xs text-black pt-2">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                  <span>Every device works from the same live MongoDB list, so no ticket gets in twice</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                  <span>Undo a check-in in one tap if a student steps out to the cafeteria</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                  <span>A separate list per door or auditorium, each with its own live counter</span>
                </div>
              </div>

              <div className="pt-4">
                <span className="font-mono text-xs font-bold text-black bg-[#E9D5FF] px-3 py-1.5 border border-black">
                  Interactive Demo: Click "Check out" or "Check in" on the phone →
                </span>
              </div>
            </div>

            {/* Right Phone Mockup (Exact Hi.events front door view) */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-sm rounded-[36px] p-4 bg-black border-4 border-black shadow-[10px_10px_0px_#F5DF4D]">
                <div className="rounded-[24px] bg-white text-slate-900 p-5 overflow-hidden font-sans border-2 border-slate-200">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="text-[10px] font-mono tracking-wider text-slate-400">CHECK-IN</span>
                      <span>Front door</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      <span>{checkedInCount}/{attendees.length}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="mt-3 relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={doorSearch}
                      onChange={(e) => setDoorSearch(e.target.value)}
                      placeholder="Search by name, roll # or ticket"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black font-mono"
                    />
                  </div>

                  {/* 2 Big Counters */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-left">
                      <div className="text-lg font-black text-slate-900">
                        {checkedInCount}<span className="text-xs font-normal text-slate-400">/{attendees.length}</span>
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        CHECKED IN
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-left">
                      <div className="text-lg font-black text-slate-900">
                        {remainingCount}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        REMAINING
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 mt-3 pb-2 text-[10px] font-mono font-bold">
                    <button
                      onClick={() => setDoorFilter('all')}
                      className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        doorFilter === 'all'
                          ? 'bg-black text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All {attendees.length}
                    </button>
                    <button
                      onClick={() => setDoorFilter('remaining')}
                      className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        doorFilter === 'remaining'
                          ? 'bg-black text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Remaining {remainingCount}
                    </button>
                    <button
                      onClick={() => setDoorFilter('checked_in')}
                      className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        doorFilter === 'checked_in'
                          ? 'bg-black text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Checked in {checkedInCount}
                    </button>
                  </div>

                  {/* Attendee Live List */}
                  <div className="mt-1 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {filteredAttendees.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white shadow-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              a.checkedIn
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {a.checkedIn ? '✓' : a.name.charAt(0)}
                          </div>
                          <div className="truncate text-left">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {a.name}
                            </p>
                            <p className="text-[9px] text-slate-400 font-mono truncate">
                              {a.code} • {a.type}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleCheckIn(a.id)}
                          className={`ml-2 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer shrink-0 ${
                            a.checkedIn
                              ? 'bg-[#EF4444] text-white hover:bg-rose-600'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {a.checkedIn ? 'Check out' : 'Check in'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FREQUENTLY ASKED QUESTIONS
         ======================================================== */}
      <section className="bg-white text-black py-20 px-4 sm:px-8 border-b-4 border-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-[#F5DF4D] text-black font-mono font-black text-xs px-3.5 py-1 border border-black shadow-[2px_2px_0px_#000] inline-block mb-3">
              KNOWLEDGE BASE
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black tracking-tight uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border-2 border-black bg-[#FAF8F5] shadow-[4px_4px_0px_#000] rounded-none overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-display font-black text-sm sm:text-base text-black flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 font-mono text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-black/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FAST PORTAL LAUNCH ACCELERATOR
         ======================================================== */}
      <section className="bg-[#F5DF4D] text-black py-16 px-4 sm:px-8 border-b-4 border-black text-center">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white text-black font-mono font-black text-xs px-3.5 py-1 border border-black shadow-[2px_2px_0px_#000] inline-block mb-4">
            GET STARTED NOW
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-black tracking-tight uppercase mb-4">
            EXPERIENCE CAMPUSCONNECT TODAY
          </h2>
          <p className="font-mono text-xs sm:text-sm text-black/80 max-w-lg mx-auto mb-8">
            Register your student account in seconds or sign in to browse upcoming hackathons, sports championships, and seminars.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-black text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#FFF] hover:shadow-[1px_1px_0px_#FFF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              CREATE NEW ACCOUNT →
            </Link>
            <Link
              to="/login?role=student"
              className="px-6 py-3.5 bg-white text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-slate-100 transition-all"
            >
              STUDENT SIGN IN
            </Link>
            <Link
              to="/login?role=admin"
              className="px-6 py-3.5 bg-[#BAE6FD] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-sky-200 transition-all"
            >
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. FOOTER (Matches CONFERIO reference footer)
         ======================================================== */}
      <footer className="bg-black text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-xl text-white tracking-tighter uppercase">
              CONFERIO<span className="text-[#F5DF4D]">.CC</span>
            </span>
            <span className="text-slate-600 font-mono">|</span>
            <span className="font-mono text-xs text-slate-400">
              CampusConnect Modern Event & Ticketing Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-slate-400">
            <a href="#events" className="hover:text-white transition-colors">Events</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            <a href="#tickets" className="hover:text-white transition-colors">Passes</a>
            <a href="#door-app" className="hover:text-white transition-colors">Door App</a>
            <Link to="/login" className="hover:text-[#F5DF4D] transition-colors">Sign In</Link>
            <Link to="/register" className="text-[#F5DF4D] hover:underline font-bold">Register Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
