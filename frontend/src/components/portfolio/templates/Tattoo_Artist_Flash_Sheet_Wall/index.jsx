import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  ChevronDown, Send, CheckCircle, HelpCircle, Palette, Sparkles,
  Info, Calendar, Clock, Image as ImageIcon, Layers
} from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import dummyData from '../../../../data/dummy_data.json';

/* ── Design Tokens ─────────────────────────────────────────────── */
const TOKENS = {
  // Normal Mode (Shaded Ink Shop)
  inkBlack: '#0a0a0a',
  basalt: '#121212',
  parchment: '#dfd2bc',
  bloodRed: '#a80f0f',
  charcoal: '#1c1c1c',
  steel: '#4e4e4e',
  
  // Stencil Mode (Violet Transfer Paper)
  stencilBg: '#090014',
  stencilPurple: '#7b2cbf',
  stencilNeon: '#9d4edd',
  stencilLight: '#e0aaff',
  
  // Fonts
  gothic: "'Cinzel Decorative', 'Cinzel', Georgia, serif",
  serif: "'Playfair Display', 'Times New Roman', serif",
  mono: "'Courier New', 'Courier', monospace"
};

/* ── Global Styles ─────────────────────────────────────────────── */
function GlobalStyles({ stencilMode }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@500;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,500&family=Special+Elite&display=swap');

      .tattoo-root {
        font-family: ${stencilMode ? TOKENS.mono : TOKENS.serif};
        background-color: ${stencilMode ? TOKENS.stencilBg : TOKENS.inkBlack};
        color: ${stencilMode ? TOKENS.stencilLight : TOKENS.parchment};
        transition: background-color 0.4s ease, color 0.4s ease;
        min-height: 100vh;
      }

      /* Carbon Stencil Grid Overlay */
      .tattoo-stencil-grid {
        background-size: 20px 20px;
        background-image: linear-gradient(to right, rgba(123, 44, 191, 0.08) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(123, 44, 191, 0.08) 1px, transparent 1px);
      }

      /* Flash Sheet Card Pinned styling */
      .tattoo-flash-sheet {
        background-color: ${stencilMode ? 'rgba(123, 44, 191, 0.05)' : '#dfd2bc'};
        border: ${stencilMode ? `2px solid ${TOKENS.stencilPurple}` : '1px solid #c8a870'};
        color: ${stencilMode ? TOKENS.stencilLight : '#1c1c1c'};
        box-shadow: ${stencilMode ? `0 0 15px rgba(123, 44, 191, 0.3)` : '4px 4px 15px rgba(0,0,0,0.6)'};
        position: relative;
        transform: rotate(var(--rotation, 0deg));
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.4s ease;
      }
      .tattoo-flash-sheet:hover {
        transform: rotate(0deg) scale(1.02);
        box-shadow: ${stencilMode ? `0 0 25px rgba(157, 78, 221, 0.6)` : '6px 6px 20px rgba(0,0,0,0.8)'};
        z-index: 10;
      }

      /* Masking Tape Corners */
      .tattoo-tape-top-left {
        position: absolute;
        top: -10px;
        left: -15px;
        width: 60px;
        height: 20px;
        background-color: rgba(220, 200, 160, 0.6);
        border: 1px solid rgba(200, 180, 140, 0.4);
        transform: rotate(-35deg);
        opacity: ${stencilMode ? 0.2 : 0.85};
        box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
      }
      .tattoo-tape-top-right {
        position: absolute;
        top: -10px;
        right: -15px;
        width: 60px;
        height: 20px;
        background-color: rgba(220, 200, 160, 0.6);
        border: 1px solid rgba(200, 180, 140, 0.4);
        transform: rotate(35deg);
        opacity: ${stencilMode ? 0.2 : 0.85};
        box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
      }

      /* Metallic pin heads */
      .tattoo-pin {
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: radial-gradient(circle at 4px 4px, #cccccc, #333333);
        box-shadow: 1px 2px 4px rgba(0,0,0,0.5);
        opacity: ${stencilMode ? 0.1 : 1};
      }

      /* Custom scrollbar matching dark tattoo vibes */
      .tattoo-root::-webkit-scrollbar {
        width: 10px;
      }
      .tattoo-root::-webkit-scrollbar-track {
        background: ${stencilMode ? TOKENS.stencilBg : TOKENS.inkBlack};
      }
      .tattoo-root::-webkit-scrollbar-thumb {
        background: ${stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed};
        border-radius: 4px;
        border: 2px solid ${stencilMode ? TOKENS.stencilBg : TOKENS.inkBlack};
      }

      /* Ink droplet indicator cursor / animation */
      @keyframes ink-drop {
        0% { transform: translateY(-5px); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(15px); opacity: 0; }
      }
      .tattoo-ink-drop {
        animation: ink-drop 1.8s infinite ease-in;
      }
    `}</style>
  );
}

/* ── Ink Bottle SVG Component ──────────────────────────────────── */
function InkBottle({ name, level, color, stencilMode }) {
  const fillHeight = (level / 100) * 55; // Container height is ~55
  const fillY = 90 - fillHeight;
  const activeColor = stencilMode ? TOKENS.stencilPurple : color;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={75} height={120} viewBox="0 0 100 120" className="overflow-visible">
        {/* Glow behind in stencil mode */}
        {stencilMode && (
          <filter id="glow-effect">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}
        
        {/* Bottle Glass Body */}
        <path 
          d="M 38 18 L 62 18 L 62 26 L 76 36 L 76 96 C 76 103, 69 110, 60 110 L 40 110 C 31 110, 24 103, 24 96 L 24 36 L 38 26 Z" 
          fill="none" 
          stroke={stencilMode ? TOKENS.stencilPurple : '#dfd2bc'} 
          strokeWidth={stencilMode ? 2.5 : 3.5} 
          filter={stencilMode ? "url(#glow-effect)" : undefined}
        />
        {/* Cap */}
        <rect 
          x={35} 
          y={6} 
          width={30} 
          height={12} 
          rx={2} 
          fill={stencilMode ? 'none' : '#dfd2bc'} 
          stroke={stencilMode ? TOKENS.stencilPurple : 'none'}
          strokeWidth={stencilMode ? 2 : 0}
        />
        {/* Bottle Neck Lines */}
        <line x1={38} y1={23} x2={62} y2={23} stroke={stencilMode ? TOKENS.stencilPurple : '#dfd2bc'} strokeWidth={1.5} />
        
        {/* Ink Level */}
        <path 
          d={`M 27 ${fillY} L 73 ${fillY} L 73 96 C 73 100, 69 107, 60 107 L 40 107 C 31 107, 27 100, 27 96 Z`}
          fill={activeColor} 
          opacity={stencilMode ? 0.3 : 0.8}
        />

        {/* Outline of liquid in stencil mode */}
        {stencilMode && (
          <path 
            d={`M 27 ${fillY} L 73 ${fillY} L 73 96 C 73 100, 69 107, 60 107 L 40 107 C 31 107, 27 100, 27 96 Z`}
            fill="none"
            stroke={TOKENS.stencilNeon}
            strokeWidth={1.5}
          />
        )}
        
        {/* Bottle Label */}
        <rect 
          x={32} 
          y={56} 
          width={36} 
          height={24} 
          rx={1} 
          fill={stencilMode ? 'rgba(123, 44, 191, 0.1)' : '#dfd2bc'} 
          stroke={stencilMode ? TOKENS.stencilPurple : '#8c7a5f'} 
          strokeWidth={1.5} 
        />
        <text 
          x={50} 
          y={71} 
          textAnchor="middle" 
          fontSize={10} 
          fontFamily="monospace" 
          fill={stencilMode ? TOKENS.stencilLight : '#1c1c1c'} 
          fontWeight="bold"
        >
          {level}%
        </text>
      </svg>
      <span className="text-[10px] font-mono tracking-wider text-center max-w-[80px] truncate uppercase" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}>
        {name}
      </span>
    </div>
  );
}

export default function TattooArtistFlashSheetWall() {
  const { portfolioData } = usePortfolio();
  const [stencilMode, setStencilMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', size: 'Medium', placement: '', description: '' });
  const [bookingSent, setBookingSent] = useState(false);
  const bookingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bookingTimerRef.current) {
        clearTimeout(bookingTimerRef.current);
      }
    };
  }, []);

  const data = portfolioData || dummyData;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSent(true);
    if (bookingTimerRef.current) {
      clearTimeout(bookingTimerRef.current);
    }
    bookingTimerRef.current = setTimeout(() => {
      setBookingSent(false);
      setBookingForm({ name: '', email: '', size: 'Medium', placement: '', description: '' });
    }, 4000);
  };

  const categories = Object.entries(
    (data.skills || []).reduce((acc, curr) => {
      const cat = curr.category || 'Core';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {})
  );

  const inkColors = ['#a80f0f', '#0f2b5c', '#1b4d3e', '#d4af37', '#e2711d', '#5a3825'];

  return (
    <div className="tattoo-root min-h-screen relative overflow-x-hidden transition-all duration-300">
      <GlobalStyles stencilMode={stencilMode} />
      
      {stencilMode && <div className="absolute inset-0 tattoo-stencil-grid pointer-events-none z-0" />}

      {/* ── Carbon Stencil Toggle Machine ──────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5">
        <motion.button
          onClick={() => setStencilMode(prev => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer shadow-lg relative overflow-hidden group"
          style={{
            background: stencilMode 
              ? 'linear-gradient(135deg, #7b2cbf, #240046)' 
              : 'linear-gradient(135deg, #1c1c1c, #0d0d0d)',
            borderColor: stencilMode ? TOKENS.stencilNeon : TOKENS.bloodRed,
            boxShadow: stencilMode ? '0 0 15px rgba(157, 78, 221, 0.4)' : '0 10px 20px rgba(0,0,0,0.5)'
          }}
          title={stencilMode ? "Toggle Shaded Ink View" : "Toggle Carbon Stencil View"}
          aria-label={stencilMode ? "Toggle Shaded Ink View" : "Toggle Carbon Stencil View"}
        >
          {/* Machine/Transfer Gear Symbol */}
          <div className={`text-2xl font-bold flex items-center justify-center ${stencilMode ? 'text-white' : 'text-red-500'} ${stencilMode ? 'animate-pulse' : ''}`}>
            {stencilMode ? '🌀' : '🩸'}
          </div>
        </motion.button>
        <span 
          className="px-2.5 py-0.5 border rounded text-[9px] font-mono tracking-widest uppercase shadow-md select-none"
          style={{
            backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.9)' : 'rgba(18, 18, 18, 0.9)',
            borderColor: stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed,
            color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
          }}
        >
          {stencilMode ? 'STENCIL ON' : 'SHADED INK'}
        </span>
      </div>

      {/* ── Shop Signboard Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: stencilMode ? 'rgba(9, 0, 20, 0.9)' : 'rgba(10, 10, 10, 0.92)', borderColor: stencilMode ? 'rgba(123, 44, 191, 0.2)' : 'rgba(223, 210, 188, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-md border flex items-center justify-center text-lg font-bold" style={{ borderColor: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment, backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.1)' : 'rgba(223, 210, 188, 0.05)' }}>
              {stencilMode ? '𓍝' : '𓏏'}
            </div>
            <span className="text-sm tracking-[0.25em] font-extrabold uppercase" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
              {data.personal?.name?.split(' ')[0]} STUDIO
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest uppercase">
            {['About', 'Skills', 'Projects', 'Experience', 'Booking'].map((item) => (
              <button
                key={item}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:underline cursor-pointer transition-all"
                style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}
              >
                {stencilMode ? `// ${item}` : item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════
          HERO SIGNBOARD
         ═════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-12 text-center border-b" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)' }}>
        <div className="max-w-3xl relative z-10 flex flex-col items-center">
          
          {/* Status Cartouche */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 shadow-sm"
            style={{ 
              borderColor: stencilMode ? TOKENS.stencilPurple : TOKENS.parchment, 
              backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : 'rgba(223, 210, 188, 0.03)' 
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse tattoo-ink-drop" />
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}>
              {stencilMode ? 'STENCIL TRANSFER ONLINE' : '🩸 INK MACHINE CALIBRATED'}
            </span>
          </motion.div>

          {/* Gothic Shop Board Header */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="p-6 md:p-10 border-4 border-double rounded-3xl mb-8 relative max-w-2xl w-full"
            style={{
              borderColor: stencilMode ? TOKENS.stencilPurple : '#c8a870',
              backgroundColor: stencilMode ? 'rgba(12, 4, 25, 0.8)' : '#121212',
              boxShadow: stencilMode ? '0 0 30px rgba(123, 44, 191, 0.25)' : '0 20px 40px rgba(0,0,0,0.7)'
            }}
          >
            {/* Stud decorations */}
            <div className="absolute top-3 left-3 text-[10px]" style={{ color: stencilMode ? TOKENS.stencilPurple : '#c8a870' }}>✴</div>
            <div className="absolute top-3 right-3 text-[10px]" style={{ color: stencilMode ? TOKENS.stencilPurple : '#c8a870' }}>✴</div>
            <div className="absolute bottom-3 left-3 text-[10px]" style={{ color: stencilMode ? TOKENS.stencilPurple : '#c8a870' }}>✴</div>
            <div className="absolute bottom-3 right-3 text-[10px]" style={{ color: stencilMode ? TOKENS.stencilPurple : '#c8a870' }}>✴</div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-[0.1em] uppercase mb-4" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
              {data.personal?.name}
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.bloodRed }}>
              {stencilMode ? `STENCIL // ${data.personal?.title}` : `✴ ${data.personal?.title} ✴`}
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg italic max-w-lg leading-relaxed mb-10 text-muted-foreground"
          >
            &ldquo;{data.personal?.tagline}&rdquo;
          </motion.p>

          {/* Stats Polaroid-like Board */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center max-w-lg mb-10 w-full"
          >
            {[
              { label: 'Years Needle', value: data.stats?.yearsExperience ?? '5+' },
              { label: 'Flash Sheets Done', value: data.stats?.projectsCompleted ?? '40+' },
              { label: 'Pleased Skins', value: data.stats?.happyClients ?? '35+' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="border p-4 flex-1 min-w-[120px] rounded-lg shadow-md flex flex-col justify-center items-center"
                style={{ 
                  borderColor: stencilMode ? 'rgba(123, 44, 191, 0.3)' : 'rgba(223, 210, 188, 0.1)', 
                  backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.03)' : '#161616' 
                }}
              >
                <span className="text-2xl font-black font-mono" style={{ color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>{stat.value}</span>
                <span className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase text-center mt-2.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-extrabold text-xs tracking-widest uppercase px-6 py-3.5 rounded-md cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: stencilMode ? 'transparent' : TOKENS.bloodRed,
                border: stencilMode ? `1px solid ${TOKENS.stencilNeon}` : 'none',
                color: stencilMode ? TOKENS.stencilNeon : 'white',
                boxShadow: stencilMode ? '0 0 15px rgba(157, 78, 221, 0.3)' : '0 4px 12px rgba(168, 15, 15, 0.3)'
              }}
            >
              Browse Flash Wall
            </button>
            <button
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="border font-extrabold text-xs tracking-widest uppercase px-6 py-3.5 rounded-md cursor-pointer transition-all hover:bg-white/5"
              style={{
                borderColor: stencilMode ? TOKENS.stencilPurple : TOKENS.parchment,
                color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
              }}
            >
              Book Session
            </button>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-6 flex flex-col items-center gap-1.5 text-muted-foreground text-xs font-mono tracking-widest animate-bounce">
          <span>DOWN</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          ABOUT SECTION (ARTIST LINER NOTES)
         ═════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 px-6 max-w-5xl mx-auto border-b" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Polaroid Avatar Column */}
          <div className="flex flex-col items-center">
            <div className="relative p-3 bg-white border border-gray-300 rounded shadow-xl max-w-[260px] w-full" style={{ transform: 'rotate(-2deg)', filter: stencilMode ? 'sepia(0.8) hue-rotate(240deg) saturate(3) contrast(1.2)' : 'grayscale(1) contrast(1.05)' }}>
              {/* Pinned tape decoration */}
              <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/60 border border-yellow-200/30 -rotate-2 shadow-sm" />
              
              <div className="aspect-[4/5] overflow-hidden rounded border border-gray-200 bg-gray-100 mb-4">
                {data.personal?.avatar ? (
                  <img
                    src={data.personal.avatar}
                    alt={data.personal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 font-serif">
                    ✒
                  </div>
                )}
              </div>
              <div className="text-center font-mono text-[10px] text-gray-600 tracking-wider uppercase py-1">
                // ARTIST PORTRAIT
              </div>
            </div>

            {/* Social icons */}
            <div className="flex justify-center gap-3 mt-8">
              {[
                { url: data.socials?.github, icon: Github, name: 'github', col: '#171515' },
                { url: data.socials?.linkedin, icon: Linkedin, name: 'linkedin', col: '#0072b1' },
                { url: data.socials?.twitter, icon: Twitter, name: 'twitter', col: '#1da1f2' },
                { url: data.socials?.email ? `mailto:${data.socials.email}` : null, icon: Mail, name: 'email', col: TOKENS.bloodRed }
              ].filter(s => s.url).map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                  style={{
                    borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.3)',
                    backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : 'rgba(18, 18, 18, 0.6)',
                    color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
                  }}
                  aria-label={s.name}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>

            {data.personal?.location && (
              <div className="mt-4 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <MapPin size={11} className={stencilMode ? 'text-purple-500' : 'text-red-600'} />
                <span>{data.personal.location}</span>
              </div>
            )}
          </div>

          {/* Liner Notes Card */}
          <div className="md:col-span-2">
            <div className="tattoo-flash-sheet p-6 sm:p-10" style={{ '--rotation': '1.5deg' }}>
              <div className="tattoo-tape-top-left" />
              <div className="tattoo-tape-top-right" />
              
              <h3 className="font-bold text-xl sm:text-2xl mb-4 border-b pb-2 uppercase tracking-wide" style={{ fontFamily: TOKENS.gothic, borderColor: stencilMode ? 'rgba(123, 44, 191, 0.2)' : 'rgba(0,0,0,0.1)' }}>
                {stencilMode ? '// LINER NOTES // ' : '✴ L I N E R  N O T E S ✴'}
              </h3>
              
              <p className="text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line">
                {data.personal?.bio}
              </p>

              {/* Decorative machine signature outline */}
              <div className="flex justify-end mt-8 font-mono text-[9px] uppercase opacity-60">
                {stencilMode ? 'STENCIL TRANSFER SECURE' : 'HEALED WORK APPROVED'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SKILLS SECTION (INK BOTTLES WALL)
         ═════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-24 px-6 max-w-5xl mx-auto border-b" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)' }}>
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase mb-4" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
            {stencilMode ? '// INK METERS //' : '🩸 Ink Bottles Wall'}
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed }} />
        </div>

        {/* Category shelves */}
        <div className="space-y-16">
          {categories.map(([category, list], ci) => (
            <div 
              key={category}
              className="p-6 rounded-2xl border"
              style={{
                borderColor: stencilMode ? 'rgba(123, 44, 191, 0.2)' : 'rgba(223, 210, 188, 0.05)',
                backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.02)' : 'rgba(18, 18, 18, 0.3)'
              }}
            >
              {/* Shelf header */}
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase font-bold mb-8 flex items-center justify-between">
                <span>{stencilMode ? `// Category: ${category}` : `✴ Shelf: ${category} ✴`}</span>
                <span className="text-[10px] opacity-40">STENCIL_MACHINE</span>
              </h3>

              {/* Ink Bottles Row */}
              <div className="flex flex-wrap justify-around gap-8">
                {list.map((skill, sIdx) => {
                  const color = inkColors[(ci + sIdx) % inkColors.length];
                  return (
                    <InkBottle
                      key={sIdx}
                      name={skill.name}
                      level={skill.level}
                      color={color}
                      stencilMode={stencilMode}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          PROJECTS SECTION (THE FLASH SHEET WALL)
         ═════════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-b" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)' }}>
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase mb-4" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
            {stencilMode ? '// THE FLASH SHEET WALL //' : '✴ The Flash Sheet Wall'}
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed }} />
        </div>

        {/* Masonry-like flex grid wall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.projects || []).map((project, idx) => {
            const rot = (idx % 3 === 0) ? '-1.5deg' : (idx % 3 === 1) ? '1deg' : '-0.5deg';
            return (
              <div 
                key={idx}
                className="tattoo-flash-sheet cursor-pointer p-5 flex flex-col justify-between"
                style={{ '--rotation': rot }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Pins and tape decoration */}
                <div className="tattoo-pin" />
                <div className="absolute top-2 right-2 text-xs font-mono opacity-25">N-{idx+1}</div>
                
                <div>
                  {/* Drawing image canvas */}
                  <div className="aspect-[4/3] rounded overflow-hidden mb-4 border bg-gray-50 flex items-center justify-center" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.2)' : 'rgba(0,0,0,0.06)', filter: stencilMode ? 'invert(1) hue-rotate(180deg) saturate(2)' : 'sepia(0.25) contrast(1.05)' }}>
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-3xl opacity-35 font-serif">✒</div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2 uppercase tracking-wide" style={{ fontFamily: TOKENS.gothic }}>
                    {project.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed text-gray-700 font-sans line-clamp-3 mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tags and Link Outlines */}
                <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(0,0,0,0.08)' }}>
                  <div className="flex flex-wrap gap-1">
                    {(project.techStack || []).slice(0, 2).map((tech, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-mono border rounded px-1.5 py-0.5 uppercase" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(0,0,0,0.15)', color: stencilMode ? TOKENS.stencilLight : 'rgba(0,0,0,0.6)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <span className="text-[10px] font-mono uppercase font-bold text-red-700 flex items-center gap-1 hover:underline" style={{ color: stencilMode ? TOKENS.stencilNeon : TOKENS.bloodRed }}>
                    Details ✒
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Lightbox Details Modal ───────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full rounded-2xl border p-6 relative overflow-hidden"
              style={{
                backgroundColor: stencilMode ? TOKENS.stencilBg : TOKENS.basalt,
                borderColor: stencilMode ? TOKENS.stencilPurple : TOKENS.parchment
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-xs font-mono border px-2 py-1 hover:bg-white/5 cursor-pointer uppercase"
                style={{ borderColor: stencilMode ? TOKENS.stencilPurple : TOKENS.parchment }}
              >
                Close [X]
              </button>

              <h3 className="text-xl sm:text-2xl font-bold uppercase mb-4 tracking-wider flex items-center gap-2" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
                <span>{selectedProject.title}</span>
                <span className="text-xs font-mono px-2 py-0.5 border rounded-full uppercase" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)', color: stencilMode ? TOKENS.stencilLight : TOKENS.bloodRed }}>Tattoo Flash Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-6">
                {/* Left visual stencil canvas */}
                <div className="aspect-[4/3] rounded border bg-gray-900 flex items-center justify-center overflow-hidden" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.15)', filter: stencilMode ? 'sepia(0.2) hue-rotate(240deg) saturate(3) contrast(1.1)' : 'grayscale(0.5)' }}>
                  {selectedProject.image ? (
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl text-gray-700">✒</div>
                  )}
                </div>

                {/* Right Details Checklist */}
                <div className="font-mono text-xs space-y-4">
                  <div>
                    <h4 className="font-bold border-b pb-1 mb-2 text-[10px] uppercase text-muted-foreground">// DESCRIPTION //</h4>
                    <p className="font-sans leading-relaxed text-muted-foreground">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h4 className="font-bold border-b pb-1 mb-2 text-[10px] uppercase text-muted-foreground">// INK OUTLINES / NEEDLE GAUGE //</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedProject.techStack || []).map((tech, idx) => (
                        <span key={idx} className="border px-2 py-0.5 rounded uppercase" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)' }}>
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1" style={{ color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
                        <Github size={12} />
                        <span>Source Code</span>
                      </a>
                    )}
                    {selectedProject.liveUrl && (
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1" style={{ color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
                        <ExternalLink size={12} />
                        <span>Live Session</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════
          EXPERIENCE SECTION (NEEDLE TRACK)
         ═════════════════════════════════════════════════════════════ */}
      <section id="experience" className="py-24 px-6 bg-basalt-alt border-b" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)', backgroundColor: stencilMode ? 'rgba(12, 4, 25, 0.2)' : TOKENS.basalt }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase mb-4" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
              {stencilMode ? '// NEEDLE TRACK TIMELINE //' : '🩸 Needle Track Chronology'}
            </h2>
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed }} />
          </div>

          {/* Needle Track */}
          <div className="border-l pl-8 space-y-12 ml-4 relative" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : TOKENS.parchment, borderStyle: stencilMode ? 'dashed' : 'solid' }}>
            {(data.experience || []).map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Needle cartridge dot marker */}
                <div 
                  className="absolute left-[-40px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold"
                  style={{
                    backgroundColor: stencilMode ? TOKENS.stencilBg : TOKENS.inkBlack,
                    borderColor: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment,
                    color: stencilMode ? TOKENS.stencilNeon : TOKENS.bloodRed
                  }}
                >
                  {idx + 1}
                </div>

                <div 
                  className="border rounded-2xl p-6 shadow-md hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.02)' : 'rgba(18, 18, 18, 0.5)',
                    borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.05)'
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}>
                        {exp.role}
                      </h3>
                      <span className="text-xs font-mono uppercase tracking-wider block mt-1" style={{ color: stencilMode ? TOKENS.stencilNeon : TOKENS.bloodRed }}>
                        {exp.company}
                      </span>
                    </div>

                    <span className="border px-3 py-1 rounded-full text-xs font-mono uppercase" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)' }}>
                      {exp.period}
                    </span>
                  </div>

                  <div className="h-px w-full my-4 opacity-15" style={{ backgroundColor: stencilMode ? TOKENS.stencilPurple : TOKENS.parchment }} />

                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-sans">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION (HEALED CLIENT skins)
         ═════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-6 max-w-5xl mx-auto border-b" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.15)' : 'rgba(223, 210, 188, 0.08)' }}>
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase mb-4" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
            {stencilMode ? '// HEALED WORK REVIEWS //' : '✴ Healed Skins (Reviews)'}
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.testimonials || []).map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white border border-gray-300 p-6 flex flex-col justify-between shadow-lg"
              style={{
                transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1.5deg'})`,
                filter: stencilMode ? 'sepia(0.8) hue-rotate(240deg) saturate(3) contrast(1.1)' : 'grayscale(1)'
              }}
            >
              {/* Polaroid-like framing */}
              <div>
                <span className="text-3xl font-serif text-gray-300 leading-none select-none">“</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans mt-1 mb-6 italic">
                  {t.text}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                {t.avatar ? (
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold font-serif text-sm">
                    ✒
                  </div>
                )}
                <div>
                  <div className="text-gray-900 font-bold text-xs uppercase tracking-wide">
                    {t.name}
                  </div>
                  <div className="text-gray-500 font-mono text-[9px] tracking-wider uppercase mt-0.5">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          CONTACT SECTION (BOOKING REQUESTS)
         ═════════════════════════════════════════════════════════════ */}
      <section id="booking" className="py-24 px-6 bg-basalt-alt" style={{ backgroundColor: stencilMode ? 'rgba(12, 4, 25, 0.2)' : TOKENS.basalt }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase mb-4" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
              {stencilMode ? '// BOOK A CONSULTATION //' : '🩸 Request Consultation Booking'}
            </h2>
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: stencilMode ? TOKENS.stencilPurple : TOKENS.bloodRed }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Details Left */}
            <div>
              <h3 className="font-bold text-xl sm:text-2xl mb-4 uppercase" style={{ fontFamily: TOKENS.gothic, color: stencilMode ? TOKENS.stencilNeon : TOKENS.parchment }}>
                Consultation Request.
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-8 font-sans">
                Make bookings, propose design ideas, or schedule studio work. Outlines, custom sizes, and custom placements are welcomed.
              </p>

              <div className="flex flex-col gap-4 font-mono text-xs">
                {data.socials?.email && (
                  <a href={`mailto:${data.socials.email}`} className="flex items-center gap-3 hover:text-white transition-colors" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}>
                    <Mail size={13} className={stencilMode ? 'text-purple-500' : 'text-red-600'} />
                    <span>{data.socials.email}</span>
                  </a>
                )}
                {data.socials?.github && (
                  <a href={data.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}>
                    <Github size={13} className={stencilMode ? 'text-purple-500' : 'text-red-600'} />
                    <span>GitHub Studio</span>
                  </a>
                )}
                {data.socials?.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors" style={{ color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment }}>
                    <Linkedin size={13} className={stencilMode ? 'text-purple-500' : 'text-red-600'} />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

            {/* Booking Form Right */}
            <div className="p-6 rounded-2xl border shadow-xl" style={{ borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.15)', backgroundColor: stencilMode ? TOKENS.stencilBg : TOKENS.inkBlack }}>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="client-name" className="text-[10px] font-mono tracking-widest text-muted-foreground block mb-1 uppercase">
                    Client Name
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    placeholder="Your name..."
                    value={bookingForm.name}
                    onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-xs font-sans focus:outline-none transition-colors"
                    style={{
                      backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : TOKENS.basalt,
                      borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)',
                      color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="client-email" className="text-[10px] font-mono tracking-widest text-muted-foreground block mb-1 uppercase">
                    Signal Email
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    placeholder="Your email..."
                    value={bookingForm.email}
                    onChange={e => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-xs font-sans focus:outline-none transition-colors"
                    style={{
                      backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : TOKENS.basalt,
                      borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)',
                      color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="design-size" className="text-[10px] font-mono tracking-widest text-muted-foreground block mb-1 uppercase">
                      Design Size
                    </label>
                    <select
                      id="design-size"
                      value={bookingForm.size}
                      onChange={e => setBookingForm(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full border rounded px-2 py-2 text-xs font-sans focus:outline-none transition-colors"
                      style={{
                        backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : TOKENS.basalt,
                        borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)',
                        color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
                      }}
                    >
                      <option value="Small">Small (Flash)</option>
                      <option value="Medium">Medium (Half-sleeve)</option>
                      <option value="Large">Large (Full Back)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="skin-placement" className="text-[10px] font-mono tracking-widest text-muted-foreground block mb-1 uppercase">
                      Skin Placement
                    </label>
                    <input
                      id="skin-placement"
                      type="text"
                      required
                      placeholder="e.g. Forearm, Back"
                      value={bookingForm.placement}
                      onChange={e => setBookingForm(prev => ({ ...prev, placement: e.target.value }))}
                      className="w-full border rounded px-3 py-2 text-xs font-sans focus:outline-none transition-colors"
                      style={{
                        backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : TOKENS.basalt,
                        borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)',
                        color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="design-description" className="text-[10px] font-mono tracking-widest text-muted-foreground block mb-1 uppercase">
                    Design Idea
                  </label>
                  <textarea
                    id="design-description"
                    required
                    rows={4}
                    placeholder="Describe your design, placement idea, and references..."
                    value={bookingForm.description}
                    onChange={e => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-xs font-sans focus:outline-none transition-colors resize-none"
                    style={{
                      backgroundColor: stencilMode ? 'rgba(123, 44, 191, 0.05)' : TOKENS.basalt,
                      borderColor: stencilMode ? TOKENS.stencilPurple : 'rgba(223, 210, 188, 0.2)',
                      color: stencilMode ? TOKENS.stencilLight : TOKENS.parchment
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded text-xs font-mono font-bold tracking-widest uppercase cursor-pointer border flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    backgroundColor: bookingSent ? '#166534' : stencilMode ? 'transparent' : TOKENS.bloodRed,
                    borderColor: bookingSent ? '#166534' : stencilMode ? TOKENS.stencilNeon : TOKENS.bloodRed,
                    color: 'white',
                    boxShadow: stencilMode ? '0 0 15px rgba(157, 78, 221, 0.2)' : 'none'
                  }}
                >
                  {bookingSent ? (
                    <>
                      <CheckCircle size={14} />
                      <span>BOOKING REQUEST INSCRIBED!</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>SEND BOOKING REQUEST</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: stencilMode ? 'rgba(123, 44, 191, 0.2)' : 'rgba(223, 210, 188, 0.1)', backgroundColor: stencilMode ? TOKENS.stencilBg : TOKENS.inkBlack }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-wider">
          <div className="text-muted-foreground">
            © {new Date().getFullYear()} {data.personal?.name} INK STUDIO
          </div>
          
          <div className="opacity-30 text-xs">
            {stencilMode ? '𓍝 🌀 𓏏' : '🩸 ✒ 🩸'}
          </div>
          
          <div className="text-muted-foreground">
            Designed by yashvi-3106 &amp; Antigravity
          </div>
        </div>
      </footer>
    </div>
  );
}
