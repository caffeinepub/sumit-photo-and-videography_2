import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Camera, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SiInstagram, SiFacebook } from 'react-icons/si';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useSitewideContent } from '../hooks/useQueries';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: sitewideContent } = useSitewideContent();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Camera className="w-8 h-8 text-rose-gold transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-foreground">Sumit Photo</span>
                <span className="font-serif text-xs text-muted-foreground -mt-1">& Videography</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
              >
                Home
              </Link>
              <Link
                to="/videos"
                className="text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
              >
                Videos
              </Link>
              <Link
                to="/special-moments"
                className="text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
              >
                Special Moments
              </Link>
              <Link
                to="/booking"
                className="text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
              >
                Book Now
              </Link>
              {isAuthenticated && isAdmin && (
                <button
                  onClick={() => navigate({ to: '/admin' })}
                  className="text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
                >
                  Admin Dashboard
                </button>
              )}
            </div>

            {/* Login Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <LoginButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-foreground"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
              <Link
                to="/"
                className="block text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/videos"
                className="block text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Videos
              </Link>
              <Link
                to="/special-moments"
                className="block text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Special Moments
              </Link>
              <Link
                to="/booking"
                className="block text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
              {isAuthenticated && isAdmin && (
                <button
                  onClick={() => {
                    navigate({ to: '/admin' });
                    setMobileMenuOpen(false);
                  }}
                  className="block text-sm font-medium text-foreground/80 hover:text-rose-gold transition-colors"
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Sumit Photo & Videography</h3>
              <p className="text-sm text-muted-foreground">
                {sitewideContent?.footerContent || "Capturing your special moments with cinematic elegance and timeless beauty."}
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-rose-gold transition-colors">
                  <SiInstagram className="w-5 h-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-rose-gold transition-colors">
                  <SiFacebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/videos" className="block text-sm text-muted-foreground hover:text-rose-gold transition-colors">
                  Videos
                </Link>
                <Link to="/special-moments" className="block text-sm text-muted-foreground hover:text-rose-gold transition-colors">
                  Special Moments
                </Link>
                <Link to="/booking" className="block text-sm text-muted-foreground hover:text-rose-gold transition-colors">
                  Book Now
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: info@sumitphoto.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Sumit Photo & Videography. All rights reserved.
            </p>
            <p className="mt-2">
              Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-gold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
