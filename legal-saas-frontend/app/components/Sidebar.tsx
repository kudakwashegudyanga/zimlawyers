'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, Briefcase, Bot, Menu, X, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLink> = ({ href, label, icon, active }) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const links: SidebarLink[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      active: pathname === '/dashboard'
    },
    {
      href: '/documents',
      label: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      active: pathname === '/documents'
    },
    {
      href: '/cases',
      label: 'Cases',
      icon: <Briefcase className="w-5 h-5" />,
      active: pathname === '/cases'
    },
    {
      href: '/assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      active: pathname === '/assistant'
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
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-800">
            <h2 className="text-lg font-semibold">ZimLayers</h2>
            <button
              onClick={onClose}
              className="sm:hidden p-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {links.map((link) => (
              <SidebarLink key={link.href} {...link} />
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-blue-800 p-4">
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
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors"
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
