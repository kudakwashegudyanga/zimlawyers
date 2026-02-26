'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Copy, Globe } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface DocumentItem {
  _id: string;
  title: string;
  content: string;
  visibility: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentListProps {
  onDocumentSelect?: (document: DocumentItem) => void;
  onCloneTemplate?: (templateId: string) => Promise<void>;
  showCreateButton?: boolean;
}

export default function DocumentList({ onDocumentSelect, onCloneTemplate, showCreateButton = true }: DocumentListProps) {
  const [privateDocuments, setPrivateDocuments] = useState<DocumentItem[]>([]);
  const [sharedTemplates, setSharedTemplates] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [privateRes, templatesRes] = await Promise.all([
        fetch(API_ENDPOINTS.MY_DOCUMENTS, { headers }),
        fetch(API_ENDPOINTS.SHARED_TEMPLATES, { headers })
      ]);

      const privateData = await privateRes.json();
      const templatesData = await templatesRes.json();

      setPrivateDocuments(privateData.documents || []);
      setSharedTemplates(templatesData.templates || []);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const onSelectDocument = (document: DocumentItem) => {
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CLONE_MULTIPLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ documentIds: [templateId] })
      });

      if (response.ok) {
        // Refresh documents after cloning
        fetchDocuments();
        alert('Template cloned successfully!');
      } else {
        throw new Error('Failed to clone template');
      }
    } catch (err) {
      alert('Error cloning template');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Private Documents */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">My Documents</h2>
        <div className="grid gap-4">
          {privateDocuments.length === 0 ? (
            <p className="text-gray-500">No private documents found</p>
          ) : (
            privateDocuments.map((doc) => (
              <div key={doc._id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectDocument(doc)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shared Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Shared Templates</h2>
        <div className="grid gap-4">
          {sharedTemplates.length === 0 ? (
            <p className="text-gray-500">No templates available</p>
          ) : (
            sharedTemplates.map((template) => (
              <div key={template._id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{template.title}</h3>
                      <p className="text-sm text-gray-500">
                        Category: {template.category || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onCloneTemplate && onCloneTemplate(template._id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Clone</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
