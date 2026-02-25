'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { CaseList } from '../components/CaseList';
import { CreateCaseForm } from '../components/CreateCaseForm';
import { Briefcase, LogOut, User, Plus, Search, Edit, Menu, X, Bot } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

interface Case {
  _id: string;
  title: string;
  description: string;
  clientName: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export default function CasesPage() {
  const { user, logout } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleCreateCase = () => {
    setEditingCase(null);
    setShowCreateForm(true);
  };

  const handleEditCase = (case_: Case) => {
    setEditingCase(case_);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingCase(null);
  };

  const handleSaveCase = (caseData: any) => {
    setRefreshKey(prev => prev + 1);
    setShowCreateForm(false);
    setEditingCase(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden sm:flex items-center space-x-8">
                <div className="flex items-center">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  <h1 className="ml-2 text-xl font-bold text-gray-900">Cases</h1>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/documents')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Documents
                </button>
                <button
                  onClick={() => router.push('/assistant')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  AI Assistant
                </button>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Lawyer'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => router.push('/dashboard')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/documents')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Documents
              </button>
              <button
                onClick={() => router.push('/assistant')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                AI Assistant
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CaseList
            key={refreshKey}
            onCreateCase={handleCreateCase}
            onEditCase={handleEditCase}
          />
        </main>

        {/* Create/Edit Case Modal */}
        {showCreateForm && (
          <CreateCaseForm
            onClose={handleCloseForm}
            onSave={handleSaveCase}
            editingCase={editingCase}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
