import { useState, useEffect } from 'react';
import { useTheme } from '../context/themeContext';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  // Navigation scrolling state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Scroll Progress Bar at the top */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-accent-purple z-[1001] transition-all duration-75 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Radial Glow */}
      <div className="radial-glow-hero" />

      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 border-b border-border z-[1000] flex items-center transition-all duration-300 ${isScrolled ? 'h-[70px] bg-bg-dark/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'h-20 bg-bg-dark/70 backdrop-blur-lg'}`}>
        <div className="max-w-[1200px] w-full mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center">
            <Logo size="md" />
          </a>
          <ul className="hidden min-[901px]:flex gap-8 list-none">
            <li><a href="#" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white transition-colors">Home</a></li>
            <li><a href="#features" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white transition-colors">Services</a></li>
            <li><a href="#how-it-works" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white transition-colors">How It Works</a></li>
            <li><a href="#testimonials" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white transition-colors">About</a></li>
            <li><a href="#footer" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white transition-colors">Contact</a></li>
          </ul>
          <div className="hidden min-[901px]:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200"
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
            <Link to="/login" className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-[0.95rem] font-semibold px-[20px] py-[8px] rounded-lg transition-all duration-200">Login</Link>
            <Link to="/register" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-[0.95rem] font-semibold px-[22px] py-[10px] rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.6)] hover:-translate-y-[1px] transition-all duration-200">Get Started</Link>
          </div>
          <div className="flex min-[901px]:hidden items-center gap-3">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200"
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
            <button 
              className="text-text-white text-[1.5rem]" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>
 
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-bg-dark-secondary border-b border-border p-6 flex flex-col gap-4 z-[999] shadow-2xl animate-fade-down">
          <a href="#" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#features" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#how-it-works" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#testimonials" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#footer" className="text-[0.95rem] font-medium text-text-gray hover:text-text-white" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <div className="flex flex-col gap-3 mt-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="border-2 border-primary text-primary text-center text-[0.95rem] font-semibold px-[22px] py-[10px] rounded-lg hover:bg-primary hover:text-white transition-all duration-200 w-full">Login</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-center text-[0.95rem] font-semibold px-[22px] py-[10px] rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.6)] hover:-translate-y-[1px] transition-all duration-200 w-full">Get Started</Link>
          </div>
        </div>
      )}
 
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[50px] lg:gap-[60px] items-center text-center lg:text-left">
          <div className="z-10">
            <ScrollReveal animation="fade-down" delay={100}>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-[0.85rem] font-bold tracking-wider mb-6">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                POWERFUL UTILITY PAYMENTS
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <h1 className="text-[2.8rem] md:text-[4rem] leading-[1.1] mb-6 font-extrabold text-text-white">
                Instant Airtime, <br />
                <span className="text-gradient-blue">Data & Bill</span> <br />
                Payments.
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <p className="text-[1.2rem] text-text-gray leading-[1.6] mb-9 max-w-[580px] lg:mx-0 mx-auto">
                Send airtime, data bundles, and pay utility bills across multiple networks instantly. 
                Fast, secure, and reliable utility payment services for individuals and businesses.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400}>
              <div className="flex flex-col min-[481px]:flex-row gap-4 mb-12 justify-center lg:justify-start items-stretch min-[481px]:items-center">
                <Link to="/register" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-center text-[0.95rem] font-semibold px-[22px] py-[10px] rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.6)] hover:-translate-y-[1px] transition-all duration-200">Create Account</Link>
                <a href="#features" className="border border-border text-text-white text-center text-[0.95rem] font-semibold px-[22px] py-[10px] rounded-lg hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200">Explore Services</a>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={500}>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-[0.9rem] text-text-white font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-green shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Lightning Fast Delivery
                </div>
                <div className="flex items-center gap-2 text-[0.9rem] text-text-white font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-green shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  99.9% Uptime SLA
                </div>
                <div className="flex items-center gap-2 text-[0.9rem] text-text-white font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-green shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Secure Payments
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Miniature Dashboard Preview */}
          <ScrollReveal animation="zoom-in" delay={250} duration={850} className="relative w-full z-10 group">
            {/* Live Demo Label */}
            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gradient-to-r from-accent-green to-emerald-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[0.65rem] md:text-[0.7rem] font-bold tracking-widest shadow-[0_4px_20px_rgba(16,185,129,0.5)] border border-white/20 flex items-center gap-2 z-20 uppercase transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Live Demo
            </div>

            <div className="w-full bg-bg-card border border-border rounded-[16px] shadow-[0_30px_60px_rgba(0,0,0,0.15),0_0_40px_rgba(59,130,246,0.02)] relative overflow-hidden flex" style={{ minHeight: '480px' }}>
            
              {/* Mini Sidebar */}
              <div className="w-[140px] shrink-0 bg-bg-dark-secondary border-r border-border flex flex-col py-3 px-2.5 gap-0.5 hidden min-[500px]:flex">
                {/* Logo */}
                <div className="flex items-center px-1 py-1 mb-2">
                  <Logo size="sm" showTagline={false} />
                </div>
                
                {/* Nav Items */}
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-primary/15 text-primary">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  <span className="text-[0.55rem] font-semibold">Dashboard</span>
                </div>
                {[
                  { label: 'Buy Airtime', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                  { label: 'Buy Data', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
                  { label: 'Electricity', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                  { label: 'Cable TV', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg> },
                  { label: 'Fund Wallet', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                  { label: 'Transactions', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-text-gray hover:text-text-white transition-colors">
                    {item.icon}
                    <span className="text-[0.55rem] font-medium">{item.label}</span>
                  </div>
                ))}

                <div className="mt-auto flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-text-gray">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span className="text-[0.55rem] font-medium">Help & Support</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[#f87171]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span className="text-[0.55rem] font-medium">Logout</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mini Topbar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-dark-secondary/50">
                  <div>
                    <div className="text-[0.65rem] font-bold text-text-white">Dashboard</div>
                    <div className="text-[0.45rem] text-text-muted">Overview of your account</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-bg-dark border border-border rounded-md px-2 py-1 flex items-center gap-1 text-[0.45rem] text-text-muted w-[80px]">
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      Search...
                    </div>
                    <div className="w-5 h-5 rounded-md border border-border flex items-center justify-center text-text-gray">
                      {theme === 'dark' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                      )}
                    </div>
                    <div className="relative">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-gray"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                    <div className="bg-accent-green/20 text-accent-green text-[0.45rem] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                      ₦150,000.00
                    </div>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-purple to-primary flex items-center justify-center text-[0.4rem] text-white font-bold">M</div>
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2.5">
                  {/* Welcome Banner */}
                  <div className="bg-gradient-to-r from-bg-dark-secondary to-bg-card border border-border rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-[0.65rem] font-bold text-text-white">Welcome Back, Michael 👋</span>
                    <span className="bg-accent-green/15 text-accent-green text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      Verified
                    </span>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-bg-card border border-border rounded-lg p-2 text-left">
                      <div className="text-[0.42rem] text-text-muted mb-0.5">Wallet Balance</div>
                      <div className="w-4 h-4 rounded-md bg-primary/20 flex items-center justify-center mb-1">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                      </div>
                      <div className="text-[0.6rem] font-bold text-text-white">₦150,000.00</div>
                      <div className="text-[0.38rem] text-accent-green mt-0.5">↗ +12.5% this month</div>
                    </div>
                    <div className="bg-bg-card border border-border rounded-lg p-2 text-left">
                      <div className="text-[0.42rem] text-text-muted mb-0.5">Total Transactions</div>
                      <div className="w-4 h-4 rounded-md bg-accent-purple/20 flex items-center justify-center mb-1">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                      </div>
                      <div className="text-[0.6rem] font-bold text-text-white">1,284</div>
                      <div className="text-[0.38rem] text-accent-green mt-0.5">↗ +8.2% this month</div>
                    </div>
                    <div className="bg-bg-card border border-border rounded-lg p-2 text-left">
                      <div className="text-[0.42rem] text-text-muted mb-0.5">Successful Purchases</div>
                      <div className="w-4 h-4 rounded-md bg-accent-green/20 flex items-center justify-center mb-1">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </div>
                      <div className="text-[0.6rem] font-bold text-text-white">1,198</div>
                      <div className="text-[0.38rem] text-accent-green mt-0.5">↗ 93.3% success rate</div>
                    </div>
                    <div className="bg-bg-card border border-border rounded-lg p-2 text-left">
                      <div className="text-[0.42rem] text-text-muted mb-0.5">Referral Earnings</div>
                      <div className="w-4 h-4 rounded-md bg-accent-orange/20 flex items-center justify-center mb-1">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      </div>
                      <div className="text-[0.6rem] font-bold text-text-white">₦25,500</div>
                      <div className="text-[0.38rem] text-accent-green mt-0.5">↗ +₦3,200 this week</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <div className="text-[0.55rem] font-bold text-text-white mb-1.5">Quick Actions</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { label: 'Buy Airtime', color: '#3b82f6', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                        { label: 'Buy Data', color: '#10b981', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> },
                        { label: 'Pay Electricity', color: '#f59e0b', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                        { label: 'Subscribe TV', color: '#a855f7', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg> },
                        { label: 'Fund Wallet', color: '#ef4444', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg> },
                      ].map((action, i) => (
                        <div key={i} className="bg-bg-dark border border-border rounded-lg p-2 flex flex-col items-center gap-1 cursor-default hover:border-border-hover transition-colors">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                            {action.icon}
                          </div>
                          <span className="text-[0.42rem] text-text-gray font-medium text-center leading-tight">{action.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-[1.4fr_0.6fr] gap-2 flex-1 min-h-0">
                    {/* Monthly Transactions Chart */}
                    <div className="bg-bg-card border border-border rounded-lg p-2.5 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <div className="text-[0.55rem] font-bold text-text-white">Monthly Transactions</div>
                          <div className="text-[0.38rem] text-text-muted">Transaction volume over the last 7 months</div>
                        </div>
                        <span className="text-[0.4rem] font-bold text-accent-green bg-accent-green/10 px-1 py-0.5 rounded">+18.6%</span>
                      </div>
                      <div className="flex-1 flex items-end pt-1">
                        <svg viewBox="0 0 280 80" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02"/>
                            </linearGradient>
                          </defs>
                          <path d="M0,65 Q20,60 40,55 T80,48 T120,40 T160,35 T200,25 T240,18 T280,10 L280,80 L0,80 Z" fill="url(#chartGrad)"/>
                          <path d="M0,65 Q20,60 40,55 T80,48 T120,40 T160,35 T200,25 T240,18 T280,10" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
                          {/* Grid lines */}
                          <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                          <line x1="0" y1="40" x2="280" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                          <line x1="0" y1="60" x2="280" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                        </svg>
                      </div>
                      <div className="flex justify-between mt-1 px-1">
                        {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                          <span key={m} className="text-[0.35rem] text-text-muted">{m}</span>
                        ))}
                      </div>
                    </div>

                    {/* Service Usage Donut */}
                    <div className="bg-bg-card border border-border rounded-lg p-2.5 flex flex-col items-center">
                      <div className="text-[0.55rem] font-bold text-text-white self-start">Service Usage</div>
                      <div className="text-[0.38rem] text-text-muted self-start mb-1">Breakdown by service</div>
                      <div className="flex-1 flex items-center justify-center">
                        <svg viewBox="0 0 80 80" width="70" height="70">
                          {/* Donut Chart */}
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray="79.17 188.5" strokeDashoffset="0" transform="rotate(-90 40 40)"/>
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="56.55 188.5" strokeDashoffset="-79.17" transform="rotate(-90 40 40)"/>
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray="33.93 188.5" strokeDashoffset="-135.72" transform="rotate(-90 40 40)"/>
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#a855f7" strokeWidth="10" strokeDasharray="18.85 188.5" strokeDashoffset="-169.65" transform="rotate(-90 40 40)"/>
                          <circle cx="40" cy="40" r="22" fill="var(--color-bg-card)"/>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 w-full">
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"/><span className="text-[0.35rem] text-text-muted">Airtime 42%</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"/><span className="text-[0.35rem] text-text-muted">Data 30%</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"/><span className="text-[0.35rem] text-text-muted">Electricity 18%</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"/><span className="text-[0.35rem] text-text-muted">Cable 10%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 border-y border-border bg-bg-dark-secondary/10 relative z-10">
        <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-[30px] md:gap-10 text-center">
          <ScrollReveal animation="fade-up" delay={50}>
            <div className="font-heading text-[2.8rem] font-bold mb-2 text-gradient-blue">
              <AnimatedCounter end={150} suffix="M+" duration={1800} />
            </div>
            <div className="text-[0.85rem] uppercase tracking-wider text-text-gray font-medium">Transactions</div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <div className="font-heading text-[2.8rem] font-bold mb-2 text-gradient-purple">
              <AnimatedCounter end={10} suffix="K+" duration={1800} delay={100} />
            </div>
            <div className="text-[0.85rem] uppercase tracking-wider text-text-gray font-medium">Active Clients</div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <div className="font-heading text-[2.8rem] font-bold mb-2 text-accent-green" style={{ color: 'var(--color-accent-green)' }}>
              <AnimatedCounter end={99.9} decimals={1} suffix="%" duration={1800} delay={200} />
            </div>
            <div className="text-[0.85rem] uppercase tracking-wider text-text-gray font-medium">Uptime SLA</div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={350}>
            <div className="font-heading text-[2.8rem] font-bold mb-2 text-accent-orange" style={{ color: 'var(--color-accent-orange)' }}>
              <AnimatedCounter end={100} suffix="+" duration={1800} delay={300} />
            </div>
            <div className="text-[0.85rem] uppercase tracking-wider text-text-gray font-medium">Supported Nations</div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-25 relative" id="features">
        <div className="radial-glow-features" />
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={50} className="text-center">
            <div className="section-tag">FEATURES</div>
            <h2 className="section-title">Everything You Need in One Platform</h2>
            <p className="section-desc">
              A complete suite of utility payment tools designed to help you pay bills and manage expenses.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl bg-bg-card p-8 text-left group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-bg-dark-secondary/50 border border-border text-primary group-hover:scale-110 group-hover:rotate-6 group-hover:border-border-hover transition-all duration-300" style={{ color: 'var(--color-accent-cyan)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="text-[1.25rem] font-bold mb-3 text-text-white">Utility Payments</h3>
                <p className="text-[0.95rem] text-text-gray leading-[1.6]">
                  Bill payments made easy. From electricity meters to cable TV providers, handle all bill dispatches instantly.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl bg-bg-card p-8 text-left group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-bg-dark-secondary/50 border border-border text-primary group-hover:scale-110 group-hover:rotate-6 group-hover:border-border-hover transition-all duration-300" style={{ color: 'var(--color-accent-green)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </div>
                <h3 className="text-[1.25rem] font-bold mb-3 text-text-white">Data & Airtime</h3>
                <p className="text-[0.95rem] text-text-gray leading-[1.6]">
                  Bulk airtime top-ups and data bundle allocations across all major networks with attractive discounts.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl bg-bg-card p-8 text-left group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-bg-dark-secondary/50 border border-border text-primary group-hover:scale-110 group-hover:rotate-6 group-hover:border-border-hover transition-all duration-300" style={{ color: 'var(--color-accent-purple)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-[1.25rem] font-bold mb-3 text-text-white">Automatic Top-ups</h3>
                <p className="text-[0.95rem] text-text-gray leading-[1.6]">
                  Schedule periodic airtime and data sends. Let our automation take care of your monthly utilities.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 4 */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl bg-bg-card p-8 text-left group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-bg-dark-secondary/50 border border-border text-primary group-hover:scale-110 group-hover:rotate-6 group-hover:border-border-hover transition-all duration-300" style={{ color: 'var(--color-primary)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className="text-[1.25rem] font-bold mb-3 text-text-white">Secure Core</h3>
                <p className="text-[0.95rem] text-text-gray leading-[1.6]">
                  Advanced security systems, end-to-end payload encryption, and automated fraud prevention routines.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 5 */}
            <ScrollReveal animation="fade-up" delay={250}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl bg-bg-card p-8 text-left group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-bg-dark-secondary/50 border border-border text-primary group-hover:scale-110 group-hover:rotate-6 group-hover:border-border-hover transition-all duration-300" style={{ color: 'var(--color-accent-orange)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <h3 className="text-[1.25rem] font-bold mb-3 text-text-white">Automated Routing</h3>
                <p className="text-[0.95rem] text-text-gray leading-[1.6]">
                  Proprietary routing engine that dynamically matches transactions against the best performing gateway.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 6 */}
            <ScrollReveal animation="fade-up" delay={350}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl bg-bg-card p-8 text-left group h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-bg-dark-secondary/50 border border-border text-primary group-hover:scale-110 group-hover:rotate-6 group-hover:border-border-hover transition-all duration-300" style={{ color: 'var(--color-accent-cyan)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                  </svg>
                </div>
                <h3 className="text-[1.25rem] font-bold mb-3 text-text-white">Detailed Reporting</h3>
                <p className="text-[0.95rem] text-text-gray leading-[1.6]">
                  Keep tabs on your spending habits, sales volumes, API success rates, and latency with real-time logs.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Infrastructure Section / Phone Mockup */}
      <section className="py-25 bg-bg-dark-secondary/10 border-y border-border relative overflow-hidden">
        <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-20 gap-15 items-center">
          <div className="text-left">
            <ScrollReveal animation="fade-right" delay={50}>
              <div className="section-tag">CORE FEATURES</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Built for Speed, Security & Scale</h2>
              <p className="section-desc" style={{ textAlign: 'left', marginLeft: 0 }}>
                Our payment infrastructure is engineered to process massive transaction request volumes with sub-second response speeds.
              </p>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 min-[481px]:grid-cols-2 gap-6">
              <ScrollReveal animation="fade-right" delay={150}>
                <div className="flex flex-col gap-3 p-5 bg-bg-card border border-border rounded-xl hover:border-border-hover transition-all duration-300 hover:-translate-y-1 h-full shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-purple-glow)', color: 'var(--color-accent-purple)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.05rem] font-bold text-text-white">Enterprise Security</h3>
                  <p className="text-[0.85rem] text-text-gray leading-[1.5]">Bank-grade security controls and double-ledger validation systems.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={250}>
                <div className="flex flex-col gap-3 p-5 bg-bg-card border border-border rounded-xl hover:border-border-hover transition-all duration-300 hover:-translate-y-1 h-full shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-green-glow)', color: 'var(--color-accent-green)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.05rem] font-bold text-text-white">Global Coverage</h3>
                  <p className="text-[0.85rem] text-text-gray leading-[1.5]">Connecting to over 600 telecommunications providers globally.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={350}>
                <div className="flex flex-col gap-3 p-5 bg-bg-card border border-border rounded-xl hover:border-border-hover transition-all duration-300 hover:-translate-y-1 h-full shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.05rem] font-bold text-text-white">Instant Settlements</h3>
                  <p className="text-[0.85rem] text-text-gray leading-[1.5]">Every transaction is accounted for and settled into your wallet instantly.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={450}>
                <div className="flex flex-col gap-3 p-5 bg-bg-card border border-border rounded-xl hover:border-border-hover transition-all duration-300 hover:-translate-y-1 h-full shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-cyan-glow)', color: 'var(--color-accent-cyan)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                  </div>
                  <h3 className="text-[1.05rem] font-bold text-text-white">Easy Setup</h3>
                  <p className="text-[0.85rem] text-text-gray leading-[1.5]">Obtain access credentials and deploy key transactions in 10 minutes.</p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Smartphone Mockup Panel */}
          <ScrollReveal animation="fade-left" delay={200} className="flex justify-center items-center relative">
            <div className="absolute w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] -z-10 pointer-events-none" />
            <div className="w-[290px] h-[580px] bg-bg-card border-[10px] border-zinc-700 dark:border-zinc-800 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col animate-float">
              <div className="w-[140px] h-[25px] bg-zinc-700 dark:bg-zinc-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-[100]" />
              <div className="grow pt-[30px] px-4 pb-4 flex flex-col gap-4 bg-bg-dark overflow-hidden text-[0.8rem] text-text-gray">
                <div className="flex justify-between items-center mt-2.5">
                  <span className="font-heading font-bold text-text-white">vtuNova</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div className="w-1 h-1 bg-text-white rounded-full" />
                    <div className="w-1 h-1 bg-text-white rounded-full" />
                    <div className="w-1 h-1 bg-text-white rounded-full" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] rounded-2xl p-4 text-white text-left shadow-md">
                  <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>USD WALLET</div>
                  <div className="text-[1.5rem] font-bold mt-1">$12,450.80</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.6rem' }}>
                    <span>Active Plan: Growth</span>
                    <span>99.99% success rate</span>
                  </div>
                </div>

                <div className="font-semibold text-text-white text-[0.75rem] text-left">Quick Actions</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center gap-1 text-[0.65rem] text-text-gray">
                    <div className="w-9 h-9 bg-bg-card border border-border rounded-xl flex items-center justify-center text-primary hover:border-border-hover transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <span>Airtime</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[0.65rem] text-text-gray">
                    <div className="w-9 h-9 bg-bg-card border border-border rounded-xl flex items-center justify-center text-primary hover:border-border-hover transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <span>Utility</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[0.65rem] text-text-gray">
                    <div className="w-9 h-9 bg-bg-card border border-border rounded-xl flex items-center justify-center text-primary hover:border-border-hover transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <span>Pay</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[0.65rem] text-text-gray">
                    <div className="w-9 h-9 bg-bg-card border border-border rounded-xl flex items-center justify-center text-primary hover:border-border-hover transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3v18h18"></path>
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                      </svg>
                    </div>
                    <span>Stats</span>
                  </div>
                </div>

                <div className="font-semibold text-text-white text-[0.75rem] text-left">Transactions</div>
                <div className="flex flex-col gap-2 max-h-[200px] overflow-hidden">
                  <div className="flex justify-between items-center p-2 bg-bg-dark-secondary rounded-lg">
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', background: '#eab308', borderRadius: '50%' }} />
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-white)', fontWeight: 600 }}>MTN Airtime</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 600 }}>-$2.40</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-bg-dark-secondary rounded-lg">
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }} />
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-white)', fontWeight: 600 }}>Airtel Data</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 600 }}>-$8.50</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-bg-dark-secondary rounded-lg">
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%' }} />
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-white)', fontWeight: 600 }}>Ikeja Power</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 600 }}>-$24.00</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Step Guide / Onboarding */}
      <section className="py-25 relative" id="how-it-works">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={50} className="text-center">
            <div className="section-tag">HOW IT WORKS</div>
            <h2 className="section-title">Get Started in 4 Simple Steps</h2>
            <p className="section-desc">
              Start dispatching utility payments in minutes with our easy onboarding.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 min-[581px]:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="p-8 md:px-6 text-center relative group bg-bg-card/40 border border-border/70 rounded-2xl h-full hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-heading text-[1.1rem] font-bold text-text-white border relative z-10 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all duration-300" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>1</div>
                <h3 className="text-[1.15rem] font-bold mb-3 text-text-white">Create Account</h3>
                <p className="text-[0.9rem] text-text-gray leading-[1.5]">Sign up for a free sandbox account in under 30 seconds.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="p-8 md:px-6 text-center relative group bg-bg-card/40 border border-border/70 rounded-2xl h-full hover:border-accent-green/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-heading text-[1.1rem] font-bold text-text-white border relative z-10 group-hover:border-accent-green group-hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300" style={{ borderColor: 'var(--color-accent-green)', color: 'var(--color-accent-green)' }}>2</div>
                <h3 className="text-[1.15rem] font-bold mb-3 text-text-white">Add Funds</h3>
                <p className="text-[0.9rem] text-text-gray leading-[1.5]">Fund your wallet using secure bank transfers, cards, or digital payment options.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-8 md:px-6 text-center relative group bg-bg-card/40 border border-border/70 rounded-2xl h-full hover:border-accent-purple/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-heading text-[1.1rem] font-bold text-text-white border relative z-10 group-hover:border-accent-purple group-hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-300" style={{ borderColor: 'var(--color-accent-purple)', color: 'var(--color-accent-purple)' }}>3</div>
                <h3 className="text-[1.15rem] font-bold mb-3 text-text-white">Link Accounts</h3>
                <p className="text-[0.9rem] text-text-gray leading-[1.5]">Securely link your bank cards or digital wallets for automated funding.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400}>
              <div className="p-8 md:px-6 text-center relative group bg-bg-card/40 border border-border/70 rounded-2xl h-full hover:border-accent-orange/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-heading text-[1.1rem] font-bold text-text-white border relative z-10 group-hover:border-accent-orange group-hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300" style={{ borderColor: 'var(--color-accent-orange)', color: 'var(--color-accent-orange)' }}>4</div>
                <h3 className="text-[1.15rem] font-bold mb-3 text-text-white">Ready to Send</h3>
                <p className="text-[0.9rem] text-text-gray leading-[1.5]">Start dispatching top-ups and bill payments with live processing.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-25" id="testimonials">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={50} className="text-center">
            <div className="section-tag">TESTIMONIALS</div>
            <h2 className="section-title">Loved by Thousands</h2>
            <p className="section-desc">
              Hear what startup founders, engineering leads, and payment managers say about VtuNova.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl p-8 text-left h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent-orange mb-5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="text-[0.95rem] text-text-white leading-[1.6] mb-6 italic">
                    "VtuNova has been an absolute game-changer for our finance ledger app. 
                    The APIs are consistently responsive and the sandbox let us test critical payouts easily."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-border flex items-center justify-center font-bold text-white text-[0.9rem]" style={{ background: '#3b82f6' }}>AO</div>
                  <div className="flex flex-col">
                    <span className="text-[0.95rem] font-semibold text-text-white">Amara Okafor</span>
                    <span className="text-[0.8rem] text-text-muted">Founder & CEO, PayFlo Startup</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl p-8 text-left h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent-orange mb-5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="text-[0.95rem] text-text-white leading-[1.6] mb-6 italic">
                    "The user interface is extremely clean and intuitive. I set up automatic utility bills for our entire remote team in under 10 minutes."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-border flex items-center justify-center font-bold text-white text-[0.9rem]" style={{ background: '#8b5cf6' }}>DB</div>
                  <div className="flex flex-col">
                    <span className="text-[0.95rem] font-semibold text-text-white">David Beckham</span>
                    <span className="text-[0.8rem] text-text-muted">Product Manager, TechCorp</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="bg-bg-dark-secondary/60 border border-border backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-border-hover hover:-translate-y-1 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.05)] hover:shadow-xl p-8 text-left h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent-orange mb-5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="text-[0.95rem] text-text-white leading-[1.6] mb-6 italic">
                    "We migrated all data allocation traffic to VtuNova and saw our processing success rates bounce from 89% straight up to 99.9%. Solid infrastructure."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-border flex items-center justify-center font-bold text-white text-[0.9rem]" style={{ background: '#ec4899' }}>SL</div>
                  <div className="flex flex-col">
                    <span className="text-[0.95rem] font-semibold text-text-white">Sarah Lewis</span>
                    <span className="text-[0.8rem] text-text-muted">Head of Product, BillShare Inc</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="pt-20 pb-25 relative z-10">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <ScrollReveal animation="zoom-in" delay={100}>
            <div className="bg-gradient-to-br from-bg-dark-secondary/90 via-primary/10 to-accent-purple/10 border border-border rounded-[24px] py-[60px] px-10 text-center relative overflow-hidden dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] shadow-xl">
              <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-1/2 h-[300px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_60%)] -z-10 pointer-events-none" />
              <h2 className="text-[2.2rem] md:text-5xl leading-[1.1] mb-4 font-extrabold text-text-white">Start Sending Airtime &amp; Data Today</h2>
              <p className="text-[1.15rem] text-text-gray max-w-[600px] mx-auto mb-9 leading-[1.6]">
                Join thousands of fast-growing applications and users using VtuNova to run automated utility payouts.
              </p>
              <div className="flex flex-col min-[481px]:flex-row justify-center gap-4 min-[481px]:items-center max-[480px]:px-5">
                <Link to="/register" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-[0.95rem] font-semibold px-[26px] py-[12px] rounded-lg shadow-[0_4px_14px_rgba(59,130,246,0.4)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] transition-all duration-200">Create Your Account</Link>
                <a href="#footer" className="border border-border text-text-white text-[0.95rem] font-semibold px-[26px] py-[12px] rounded-lg hover:bg-bg-dark hover:border-border-hover transition-all duration-200">Contact Support</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#040308] border-t border-border py-20 pb-10 text-[0.9rem]" id="footer">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 min-[481px]:grid-cols-2 min-[901px]:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 min-[901px]:gap-[60px] mb-15">
              <div className="flex flex-col items-start gap-4">
                <a href="#" className="flex items-center">
                  <Logo size="lg" />
                </a>
                <p className="text-text-gray leading-[1.6] max-w-[320px]">
                  Automated airtime distribution, data packet provisioning, and utility meter bill payments for users.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-text-gray hover:bg-white/10 hover:text-white hover:border-border-hover transition-all duration-200" aria-label="GitHub">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-text-gray hover:bg-white/10 hover:text-white hover:border-border-hover transition-all duration-200" aria-label="Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-text-gray hover:bg-white/10 hover:text-white hover:border-border-hover transition-all duration-200" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-[0.95rem] font-semibold text-white mb-6">Services</h3>
                <ul className="flex flex-col gap-3 list-none text-left">
                  <li><a href="#features" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">Airtime Top-ups</a></li>
                  <li><a href="#features" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">Data Bundles</a></li>
                  <li><a href="#features" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">Utility Payments</a></li>
                  <li><a href="#how-it-works" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">How It Works</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[0.95rem] font-semibold text-white mb-6">Resources</h3>
                <ul className="flex flex-col gap-3 list-none text-left">
                  <li><a href="#" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">Help Center</a></li>
                  <li><a href="#" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">FAQ</a></li>
                  <li><Link to="/login" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">User Dashboard</Link></li>
                  <li><a href="#" className="text-text-gray hover:text-white transition-colors duration-200 inline-block">Service Status (99.99%)</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[0.95rem] font-semibold text-white mb-6">Support</h3>
                <div className="flex items-start gap-2.5 text-text-gray mb-3 leading-[1.4]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0 mt-1">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>support@vtunova.com</span>
                </div>
                <div className="flex items-start gap-2.5 text-text-gray mb-3 leading-[1.4]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0 mt-1">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Silicon Valley HQ,<br />California, USA</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center text-text-muted text-[0.8rem] gap-5 md:gap-0 text-center md:text-left">
            <span>&copy; 2026 VtuNova Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Security Disclosures</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 w-11 h-11 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.5)] border border-white/20 transition-all duration-300 z-50 ${
          isScrolled 
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100 hover:scale-110 hover:-translate-y-1' 
            : 'opacity-0 translate-y-4 pointer-events-none scale-75'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default LandingPage;
