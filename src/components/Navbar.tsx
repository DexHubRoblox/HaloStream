import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';
import WatchlistNavLink from './WatchlistNavLink';
import AdvancedSearch from './AdvancedSearch';
import LanguageSelector from './LanguageSelector';
import NotificationCenter from './NotificationCenter';
import UserStatsModal from './UserStatsModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAdvancedSearchOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/tv-shows' },
    { name: 'Genres', href: '/genres' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="px-4 md:px-12 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-red-600 animate-fade-in">HaloStream</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all duration-200 hover:text-foreground ${
                  isActive(item.href) 
                    ? 'text-foreground font-bold' 
                    : 'text-foreground/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <WatchlistNavLink />
            
            <NotificationCenter />
            
            <button 
              onClick={() => setStatsModalOpen(true)}
              className="p-2 rounded-full transition-all hover:bg-white/10 text-white"
              aria-label="View Statistics"
            >
              <BarChart size={20} className="text-white" />
            </button>
            
            <LanguageSelector />
            
            <button 
              onClick={() => setAdvancedSearchOpen(true)}
              className="p-2 rounded-full transition-all hover:bg-white/10 text-white"
              aria-label="Advanced Search"
            >
              <Filter size={20} className="text-white" />
            </button>
            
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full transition-all hover:bg-white/10 text-white"
              aria-label="Search"
            >
              <Search size={20} className="text-white" />
            </button>
            
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full transition-all hover:bg-white/10 text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-white" />
                ) : (
                  <Menu size={20} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl overflow-hidden animate-slide-down border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-red-600 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/watchlist"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/watchlist')
                  ? 'bg-red-600 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              My Watchlist
            </Link>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="py-4 px-4 md:px-12 bg-black/95 backdrop-blur-xl border-b border-gray-800 animate-slide-down">
          <SearchBar onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Advanced Search Modal */}
      <Dialog open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen}>
        <DialogContent className="max-w-2xl bg-transparent border-none p-0">
          <DialogHeader>
            <DialogTitle className="sr-only">Advanced Search</DialogTitle>
          </DialogHeader>
          <AdvancedSearch onClose={() => setAdvancedSearchOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* User Stats Modal */}
      <UserStatsModal 
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;