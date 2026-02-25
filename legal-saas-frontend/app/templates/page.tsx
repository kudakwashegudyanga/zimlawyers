'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Filter, FileText, Eye, Download, Tag, Menu, X, LogOut, Home, FileText as Template, Briefcase, Bot, Edit, Trash2, Plus } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardSidebar from '../components/DashboardSidebar';

interface Template {
  _id: string;
  title: string;
  category: string;
  customCategory?: string;
  content: string;
  createdBy: {
    fullName: string;
    email: string;
  };
  createdAt: string;
}

const predefinedCategories = ['Murder', 'Theft', 'Fraud', 'Assault', 'Corporate Law', 'Divorce', 'Land Disputes', 'Other'];

export default function TemplatesPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('templates');

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [token]);

  const fetchTemplates = async () => {
    try {
      if (!token) return;
      
      const url = selectedCategory === 'all' 
        ? 'http://localhost:5000/api/templates'
        : `http://localhost:5000/api/templates?category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      if (!token) return;
      
      const response = await fetch('http://localhost:5000/api/templates/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || predefinedCategories);
      }
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      setCategories(predefinedCategories);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, token]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    console.log('Using template:', template.title);
    // For now, just show an alert. In the future, this could open an editor
    alert(`Template "${template.title}" would be opened in an editor for customization.`);
  };

  const handleEditTemplate = (template: Template) => {
    console.log('Editing template:', template.title);
    // For now, just show an alert. In the future, this could open an edit modal
    alert(`Edit functionality for "${template.title}" would be implemented here.`);
  };

  const handleDeleteTemplate = async (template: Template) => {
    if (!confirm(`Are you sure you want to delete "${template.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/templates/${template._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh templates list
        fetchTemplates();
        alert('Template deleted successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete template');
      }
    } catch (err: any) {
      alert(err.message || 'Network error. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Murder': 'bg-red-100 text-red-800',
      'Theft': 'bg-yellow-100 text-yellow-800',
      'Fraud': 'bg-orange-100 text-orange-800',
      'Assault': 'bg-purple-100 text-purple-800',
      'Corporate Law': 'bg-blue-100 text-blue-800',
      'Divorce': 'bg-pink-100 text-pink-800',
      'Land Disputes': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  const viewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <DashboardSidebar 
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile menu button */}
        <div className="sm:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 sm:ml-64">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h1 className="text-xl font-semibold text-gray-900">Legal Templates</h1>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Admin: Create Template Button */}
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => router.push('/templates/create')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Template
                    </button>
                  )}
                  <span className="text-sm text-gray-600">
                    {user?.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Admin: Create Template CTA */}
            {user?.role === 'ADMIN' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Create New Template</h3>
                    <p className="text-blue-700">Add a new legal template to the system for lawyers to use</p>
                  </div>
                  <button
                    onClick={() => router.push('/templates/create')}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Template
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="md:w-64">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'No templates available in this category'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div key={template._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {template.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {template.content.substring(0, 150)}...
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-500">
                        Created by {template.createdBy.fullName}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewTemplate(template)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      
                      {user?.role === 'ADMIN' ? (
                        <>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Use Template
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button for Admins */}
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => router.push('/templates/create')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center z-40"
            title="Create Template"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* Template View Modal */}
        {showModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedTemplate.category)}`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {selectedTemplate.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created by {selectedTemplate.createdBy.fullName}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                  {selectedTemplate.content}
                </pre>
              </div>
              
              <div className="p-6 border-t flex justify-end">
                <button
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setShowModal(false);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
