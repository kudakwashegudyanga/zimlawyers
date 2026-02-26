'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, FileText, Edit } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface Case {
  _id: string;
  title: string;
  description: string;
  clientName: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}

interface CaseListProps {
  onCreateCase: () => void;
  onEditCase: (case_: Case) => void;
}

export const CaseList: React.FC<CaseListProps> = ({ onCreateCase, onEditCase }) => {
  const { token } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCases(cases);
    } else {
      searchCases();
    }
  }, [searchQuery, cases]);

  const fetchCases = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CASES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }

      const data = await response.json();
      setCases(data.cases || []);
      setFilteredCases(data.cases || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const searchCases = async () => {
    if (searchQuery.trim() === '') {
      setFilteredCases(cases);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.CASES}/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search cases');
      }

      const data = await response.json();
      setFilteredCases(data.cases || []);
    } catch (err: any) {
      console.error('Search error:', err);
      // Fallback to client-side filtering
      const filtered = cases.filter(case_ =>
        case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCases(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'OPEN' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading cases...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          
          <button
            onClick={onCreateCase}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </button>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid gap-4">
        {filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No cases found' : 'No cases yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first case to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={onCreateCase}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Case</span>
              </button>
            )}
          </div>
        ) : (
          filteredCases.map((case_) => (
            <div key={case_._id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{case_.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Client: <strong>{case_.clientName}</strong></span>
                    <span>Created: {new Date(case_.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => onEditCase(case_)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors ml-4"
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
  );
};
