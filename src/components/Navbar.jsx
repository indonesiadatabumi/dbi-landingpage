// File: Navbar.jsx

// 1. Impor 'useRef' dari React
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', targetId: 'home' },
  { name: 'About Us', targetId: 'about-us' },
  { name: 'Company History', targetId: 'company-history' },
  { name: 'Services', targetId: 'services' },
  { name: 'Our Work', targetId: 'our-work' },
  { name: 'Testimoni', targetId: 'testimoni' },
  { name: 'Team', targetId: 'team' },
];

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 2. Buat sebuah ref untuk header
  const headerRef = useRef(null);

  // useEffect untuk scroll spy (ini sudah benar dari perbaikan sebelumnya)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const triggerPoint = 150; 
      let currentActiveLink = '';

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i];
        const section = document.getElementById(link.targetId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            currentActiveLink = link.name;
            break; 
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveLink('Home');
      } else if (currentActiveLink) {
        setActiveLink(currentActiveLink);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // --- PERBAIKAN UTAMA ADA DI FUNGSI INI ---
  const handleLinkClick = (linkName, targetId) => {
    setActiveLink(linkName);
    setIsMenuOpen(false);

    const targetElement = document.getElementById(targetId);
    
    // Pastikan elemen target dan ref header sudah ada
    if (targetElement && headerRef.current) {
        // 3. Ukur tinggi navbar secara dinamis
        const navbarHeight = headerRef.current.offsetHeight;
        
        // Kalkulasi posisi yang benar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
  };

  return (
    // 4. Lampirkan ref ke elemen header
    <motion.header
      ref={headerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'fixed bg-white shadow-lg dark:bg-gray-800' : 'absolute'
      }`}
    >
      <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 ${
        isScrolled ? 'p-4' : 'p-6'
      }`}>
        <div className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Data Bumi Indonesia Logo"
            className={`w-auto transition-all duration-300 ${isScrolled ? 'h-14' : 'h-24'}`}
          />
        </div>

        {/* Sisa dari JSX tidak ada yang berubah */}
        <nav className="hidden md:block">
          <ul className={`flex items-center space-x-4 transition-all duration-300 p-2 ${
            !isScrolled && 'bg-white/10 backdrop-blur-sm rounded-full'
          }`}>
            {navLinks.map((link) => (
              <li key={link.name} className="relative">
                <button
                  onClick={() => handleLinkClick(link.name, link.targetId)}
                  className={`px-5 py-2 text-base font-medium rounded-full transition-colors relative z-10 ${
                    activeLink === link.name
                      ? 'text-white'
                      : isScrolled
                        ? 'text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400'
                        : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
                {activeLink === link.name && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-blue-500 rounded-full"
                    style={{ zIndex: 5 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-md transition-colors ${isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}
            >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="2em" width="2em">
                    {isMenuOpen ? (
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    ) : (
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                    )}
                </svg>
            </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
            >
                <ul className="flex flex-col p-4">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <button
                                onClick={() => handleLinkClick(link.name, link.targetId)}
                                className={`w-full text-left font-semibold p-4 rounded-md transition-colors ${
                                    activeLink === link.name 
                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                {link.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;