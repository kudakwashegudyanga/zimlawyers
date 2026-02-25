'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Edit, Eye } from 'lucide-react';

interface Document {
  _id: string;
  title: string;
  content: string;
  visibility: string;
  category?: string;
  createdAt: string;
}

interface DocumentListProps {
  onSelectDocument: (document: Document) => void;
  onCloneTemplate: (templateId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument, onCloneTemplate }) => {
  const { token } = useAuth();
  const [privateDocuments, setPrivateDocuments] = useState<Document[]>([]);
  const [sharedTemplates, setSharedTemplates] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [privateRes, templatesRes] = await Promise.all([
        fetch('http://localhost:5000/api/documents/my-documents', { headers }),
        fetch('http://localhost:5000/api/documents/shared-templates', { headers })
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
                    onClick={() => onCloneTemplate(template._id)}
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
