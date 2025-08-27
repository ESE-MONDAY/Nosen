'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrollY > 50 
        ? theme === 'dark' 
          ? 'bg-slate-900/90 backdrop-blur-md shadow-sm' 
          : 'bg-white/90 backdrop-blur-md shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>nosen</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Features</a>
            <a href="#ens-integration" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>ENS Integration</a>
            <a href="#use-cases" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Use Cases</a>
            <a href="#pricing" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Pricing</a>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:bg-slate-800' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <ConnectWallet />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:bg-slate-800' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden border-t ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className={`block ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</a>
            <a href="#ens-integration" className={`block ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>ENS Integration</a>
            <a href="#use-cases" className={`block ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Use Cases</a>
            <a href="#pricing" className={`block ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Pricing</a>
            <div className="w-full">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
