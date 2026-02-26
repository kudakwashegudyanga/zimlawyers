'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Briefcase, Bot, TrendingUp } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { API_ENDPOINTS } from '../config/api';

interface DashboardStats {
  privateDocuments: number;
  sharedTemplates: number;
  totalCases: number;
  openCases: number;
}

export default function DashboardSection() {
  const [stats, setStats] = useState<DashboardStats>({
    privateDocuments: 0,
    sharedTemplates: 0,
    totalCases: 0,
    openCases: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [documentsRes, templatesRes, casesRes] = await Promise.all([
        fetch(API_ENDPOINTS.MY_DOCUMENTS, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(API_ENDPOINTS.SHARED_TEMPLATES, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(API_ENDPOINTS.CASES, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (documentsRes.ok && templatesRes.ok && casesRes.ok) {
        const documentsData = await documentsRes.json();
        const templatesData = await templatesRes.json();
        const casesData = await casesRes.json();

        const privateDocs = documentsData.documents?.length || 0;
        const sharedTemplates = templatesData.templates?.length || 0;
        const totalCases = casesData.cases?.length || 0;
        const openCases = casesData.cases?.filter((c: any) => c.status === 'OPEN').length || 0;

        setStats({
          privateDocuments: privateDocs,
          sharedTemplates: sharedTemplates,
          totalCases: totalCases,
          openCases: openCases
        });
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
        <h3 className="text-lg font-medium mb-2">Error Loading Dashboard</h3>
        <p>{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Here's your legal practice overview</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Private Documents Card */}
        <DashboardCard
          title="Private Documents"
          count={stats.privateDocuments}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          trend={{
            value: 3,
            isPositive: true
          }}
        />

        {/* Shared Templates Card */}
        <DashboardCard
          title="Shared Templates"
          count={stats.sharedTemplates}
          icon={<FileText className="w-6 h-6" />}
          color="green"
          trend={{
            value: 1,
            isPositive: true
          }}
        />

        {/* Total Cases Card */}
        <DashboardCard
          title="Total Cases"
          count={stats.totalCases}
          icon={<Briefcase className="w-6 h-6" />}
          color="purple"
          trend={{
            value: 2,
            isPositive: true
          }}
        />

        {/* Open Cases Card */}
        <DashboardCard
          title="Open Cases"
          count={stats.openCases}
          icon={<Briefcase className="w-6 h-6" />}
          color="green"
          trend={{
            value: 1,
            isPositive: false
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Create Document</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Briefcase className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">New Case</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <Bot className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">AI Assistant</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
