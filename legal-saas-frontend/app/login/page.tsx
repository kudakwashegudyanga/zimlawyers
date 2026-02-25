'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Scale, Gavel } from 'lucide-react';
import NoSSR from '../components/NoSSR';

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    firmName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        console.log('Attempting login with:', formData.email);
        // Use the login function from AuthContext directly
        await login(formData.email, formData.password);
        console.log('Login successful, redirecting to dashboard');
        // Login successful, redirect to dashboard
        router.push('/dashboard');
      } else {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          // Redirect to verification page after successful registration
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      console.error('Login/Registration error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoSSR>
      <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Scale className="w-10 h-10 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">ZimLayers</h1>
            </div>
            <h2 className="text-xl text-gray-600">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin 
                ? 'Sign in to manage your legal practice' 
                : 'Join Zimbabwe\'s leading legal platform. Email verification required.'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="firmName" className="block text-sm font-medium text-gray-700 mb-2">
                  Firm Name (Optional)
                </label>
                <input
                  id="firmName"
                  name="firmName"
                  type="text"
                  value={formData.firmName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe & Associates"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image and Quote */}
      <div 
        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/bgimage.jpeg")'
        }}
      >
        {/* Quote Content */}
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center max-w-lg">
            <Gavel className="w-16 h-16 text-white mx-auto mb-6" />
            
            <blockquote className="text-2xl font-bold leading-relaxed mb-6 italic text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              "Justice delayed is justice denied. In Zimbabwe's legal landscape, 
              technology empowers lawyers to deliver timely, efficient, and 
              accessible justice for all."
            </blockquote>
            
            <cite className="text-lg font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              — Lord Brougham
            </cite>
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>500+</div>
                  <div className="text-sm font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Lawyers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>10K+</div>
                  <div className="text-sm font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Cases Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>98%</div>
                  <div className="text-sm font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-white text-sm font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Trusted by Zimbabwe's leading legal professionals
            </div>
          </div>
        </div>
      </div>
    </div>
    </NoSSR>
  );
}
