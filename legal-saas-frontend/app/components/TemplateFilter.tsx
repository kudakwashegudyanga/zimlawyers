'use client';

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

interface TemplateFilterProps {
  onFilterChange: (category: string) => void;
}

export const TemplateFilter: React.FC<TemplateFilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/documents/templates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const uniqueCategories = [...new Set(
          data.templates
            .map((template: any) => template.category)
            .filter((cat: any): cat is string => cat && cat.trim() !== '')
        )];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="flex items-center space-x-3 mb-6">
      <Filter className="w-5 h-5 text-gray-600" />
      <label className="text-sm font-medium text-gray-700">
        Filter by Category:
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        disabled={loading}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};
