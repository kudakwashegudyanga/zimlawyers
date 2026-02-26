'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardSection from '../components/DashboardSection';
import DocumentsSection from '../components/DocumentsSection';
import CasesSection from '../components/CasesSection';
import AssistantSection from '../components/AssistantSection';
import ProtectedRoute from '../components/ProtectedRoute';
import NoSSR from '../components/NoSSR';
import { API_ENDPOINTS } from '../config/api';

interface Document {
  _id: string;
  title: string;
  content: string;
  visibility: string;
  category?: string;
  createdAt: string;
}

interface Case {
  _id: string;
  title: string;
  description: string;
  clientName: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [documentsRes, setDocumentsRes] = useState<Response | null>(null);
  const [templatesRes, setTemplatesRes] = useState<Response | null>(null);
  const [casesRes, setCasesRes] = useState<Response | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      const [documents, templates, cases] = await Promise.all([
        fetch(API_ENDPOINTS.MY_DOCUMENTS, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_ENDPOINTS.SHARED_TEMPLATES, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_ENDPOINTS.CASES, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      setDocumentsRes(documents);
      setTemplatesRes(templates);
      setCasesRes(cases);
    };
    fetchResources();
  }, [token]);

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    // You could open a modal here for editing
  };

  const handleEditCase = (case_: Case) => {
    setEditingCase(case_);
    // You could open a modal here for editing
  };

  const handleCreateCase = () => {
    setShowCreateCase(true);
    // You could open a modal here for creating
  };

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardSection />;
      case 'documents':
        return <DocumentsSection onEditDocument={handleEditDocument} />;
      case 'templates':
        // For lawyers, show templates view
        if (user?.role === 'LAWYER') {
          window.location.href = '/templates';
          return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
        }
        // For admins, show create template page
        if (user?.role === 'ADMIN') {
          window.location.href = '/templates/create';
          return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
        }
        return <DashboardSection />;
      case 'cases':
        return <CasesSection onEditCase={handleEditCase} onCreateCase={handleCreateCase} />;
      case 'assistant':
        return <AssistantSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <ProtectedRoute>
      <NoSSR>
        <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile menu button */}
        <div className="sm:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <DashboardSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 sm:ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.fullName}
                  </h1>
                  <p className="text-gray-600">
                    {activePage === 'dashboard' && 'Here\'s your legal practice overview'}
                    {activePage === 'documents' && 'Manage your legal documents'}
                    {activePage === 'cases' && 'Track your legal cases'}
                    {activePage === 'assistant' && 'Get AI assistance for legal matters'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 h-full">
            {renderMainContent()}
          </main>
        </div>
      </div>
      </NoSSR>
    </ProtectedRoute>
  );
}
