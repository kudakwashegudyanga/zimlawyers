'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Copy, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DocumentItem {
  _id: string;
  title: string;
  content: string;
  visibility: string;
  category?: string;
  createdAt: string;
}

interface DocumentsSectionProps {
  onEditDocument: (document: DocumentItem) => void;
}

export default function DocumentsSection({ onEditDocument }: DocumentsSectionProps) {
  const { token } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [templates, setTemplates] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (token) {
      fetchDocuments();
      fetchTemplates();
    }
  }, [token]);

  const fetchDocuments = async () => {
    try {
      if (!token) {
        console.log('No token available for fetching documents');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/documents/my-documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        throw new Error('Failed to fetch documents');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      console.log('DocumentsSection - Token available:', !!token);
      console.log('DocumentsSection - Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        console.log('No token available for fetching templates');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/documents/shared-templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Templates response status:', response.status);
      console.log('Templates response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Templates data received:', data.templates?.length || 0);
        setTemplates(data.templates || []);
      } else {
        const errorText = await response.text();
        console.error('Templates response text:', errorText);
        console.error('Templates response headers:', Object.fromEntries(response.headers.entries()));
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Templates API error:', errorData);
        // Don't throw error here, just log it and continue
        console.warn('Templates fetch failed, but continuing...');
      }
    } catch (err: any) {
      console.error('Error fetching templates:', err);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/documents/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });

      if (response.ok) {
        fetchDocuments(); // Refresh documents
      } else {
        throw new Error('Failed to clone template');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="contract">Contracts</option>
            <option value="letter">Letters</option>
            <option value="court">Court Documents</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Private Documents</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDocuments.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shared Templates</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTemplates.length}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDocuments.length + filteredTemplates.length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDocuments.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No documents found
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-500">Created {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditDocument(doc)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Shared Templates</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTemplates.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No templates available
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{template.title}</h4>
                  <p className="text-sm text-gray-500">Category: {template.category || 'General'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCloneTemplate(template._id)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
