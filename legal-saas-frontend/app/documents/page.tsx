'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { DocumentList } from '../components/DocumentList';
import { DocumentEditor } from '../components/DocumentEditor';
import { TemplateFilter } from '../components/TemplateFilter';
import { FileText, LogOut, User, Bot, Menu, X } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

interface Document {
  _id: string;
  title: string;
  content: string;
  visibility: string;
  category?: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const { user, logout } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleCloseEditor = () => {
    setSelectedDocument(null);
  };

  const handleSaveDocument = (updatedDocument: any) => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/documents/clone-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templateIds: [templateId] })
      });

      if (!response.ok) {
        throw new Error('Failed to clone template');
      }

      const data = await response.json();
      alert(`Template cloned successfully! ${data.documents.length} document created.`);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert(error.message || 'Failed to clone template');
    }
  };

  const handleFilterChange = (category: string) => {
    // This would filter the templates in DocumentList
    // For now, we'll just trigger a refresh
    setRefreshKey(prev => prev + 1);
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
                  <FileText className="w-8 h-8 text-blue-600" />
                  <h1 className="ml-2 text-xl font-bold text-gray-900">Documents</h1>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/cases')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cases
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
                  onClick={logout}
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
                onClick={() => router.push('/cases')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Cases
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

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Document Management</h2>
              <p className="text-gray-600 mb-6">
                Manage your legal documents, templates, and collaborate with your team.
              </p>
              
              <TemplateFilter
                onFilterChange={() => setRefreshKey(prev => prev + 1)}
              />
            </div>
          </div>

          <DocumentList
            key={refreshKey}
            onSelectDocument={handleSelectDocument}
            onCloneTemplate={handleCloneTemplate}
          />
        </main>

        {/* Document Editor Modal */}
        {selectedDocument && (
          <DocumentEditor
            document={selectedDocument}
            onClose={handleCloseEditor}
            onSave={handleSaveDocument}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
