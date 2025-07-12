import { LogIn, LogOut } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface NavbarProps {
  logo: React.ReactNode;
  menuItems?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }[];
  className?: string;
  isLoggedIn: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  logo, 
  menuItems = [], 
  className = '', 
  isLoggedIn, 
  onLogin, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {logo}
            </div>
          </div>

          {/* Menu items in the center */}
          {isLoggedIn && menuItems.length > 0 && (
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={item.onClick}
                  variant="ghost"
                  className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.icon && (
                    <span className="mr-2">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Button>
              ))}
            </div>
          )}

          {/* User actions on the right */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {isMobileMenuOpen ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Desktop sign out */}
                <div className="hidden md:block">
                  <Button
                    variant="destructive"
                    onClick={onLogout}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={onLogin}
                variant="default"
                className="flex items-center bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isLoggedIn && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex flex-col space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => {
                  onLogout?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};