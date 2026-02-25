'use client';

import React from 'react';
import { FileText, Briefcase, Bot, Menu, X, LogOut, Home, FileText as Template } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

const SidebarLink: React.FC<{
  link: SidebarLink;
  active: boolean;
  onClick: () => void;
}> = ({ link, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-blue-100 hover:bg-blue-700'
      }`}
    >
      {link.icon}
      <span className="font-medium">{link.label}</span>
    </button>
  );
};

export default function DashboardSidebar({ 
  activePage, 
  setActivePage, 
  isOpen, 
  onClose 
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const links: SidebarLink[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      href: '/dashboard'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      href: '/dashboard'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <Template className="w-5 h-5" />,
      href: '/templates'
    },
    {
      id: 'cases',
      label: 'Cases',
      icon: <Briefcase className="w-5 h-5" />,
      href: '/cases'
    },
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      href: '/dashboard'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-700">
            <h2 className="text-lg font-semibold">ZimLayers</h2>
            <button
              onClick={onClose}
              className="sm:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {links.map((link) => (
              <SidebarLink
                key={link.id}
                link={link}
                active={activePage === link.id}
                onClick={() => {
                  setActivePage(link.id);
                  if (link.href) {
                    window.location.href = link.href;
                  }
                  onClose();
                }}
              />
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-blue-700 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.fullName || 'User'}</p>
                <p className="text-xs text-blue-300">{user?.role || 'Lawyer'}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
