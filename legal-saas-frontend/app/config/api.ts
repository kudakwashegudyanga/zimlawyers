// Centralized API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  VERIFY_EMAIL: `${API_URL}/api/auth/verify-email`,
  
  // Document endpoints
  MY_DOCUMENTS: `${API_URL}/api/documents/my-documents`,
  SHARED_TEMPLATES: `${API_URL}/api/documents/shared-templates`,
  CREATE_DOCUMENT: `${API_URL}/api/documents`,
  UPDATE_DOCUMENT: (id: string) => `${API_URL}/api/documents/${id}`,
  DELETE_DOCUMENT: (id: string) => `${API_URL}/api/documents/${id}`,
  CLONE_MULTIPLE: `${API_URL}/api/documents/clone-multiple`,
  
  // Case endpoints
  CASES: `${API_URL}/api/cases`,
  CREATE_CASE: `${API_URL}/api/cases`,
  UPDATE_CASE: (id: string) => `${API_URL}/api/cases/${id}`,
  DELETE_CASE: (id: string) => `${API_URL}/api/cases/${id}`,
  
  // Draft endpoints
  DRAFTS: `${API_URL}/api/drafts`,
  GET_DRAFT: (id: string) => `${API_URL}/api/drafts/${id}`,
  UPDATE_DRAFT: (id: string) => `${API_URL}/api/drafts/${id}`,
  DELETE_DRAFT: (id: string) => `${API_URL}/api/drafts/${id}`,
  
  // Template endpoints
  TEMPLATES: `${API_URL}/api/documents/templates`,
  CREATE_TEMPLATE: `${API_URL}/api/documents/templates`,
  UPDATE_TEMPLATE: (id: string) => `${API_URL}/api/documents/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `${API_URL}/api/documents/templates/${id}`,
};
