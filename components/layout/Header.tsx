import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '../../lib/auth';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Garage Tracker
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={pathname === '/' ? 'font-bold' : ''}>
              Home
            </Link>
            <Link
              href="/boxes"
              className={pathname?.startsWith('/boxes') ? 'font-bold' : ''}
            >
              Boxes
            </Link>
            <Link
              href="/items"
              className={pathname?.startsWith('/items') ? 'font-bold' : ''}
            >
              Items
            </Link>
            <Link
              href="/search"
              className={pathname === '/search' ? 'font-bold' : ''}
            >
              Search
            </Link>
            {user ? (
              <button onClick={handleSignOut}>Sign Out</button>
            ) : (
              <Link href="/login">Sign In</Link>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3">
            <Link
              href="/"
              className={`block ${pathname === '/' ? 'font-bold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/boxes"
              className={`block ${
                pathname?.startsWith('/boxes') ? 'font-bold' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Boxes
            </Link>
            <Link
              href="/items"
              className={`block ${
                pathname?.startsWith('/items') ? 'font-bold' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Items
            </Link>
            <Link
              href="/search"
              className={`block ${pathname === '/search' ? 'font-bold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
