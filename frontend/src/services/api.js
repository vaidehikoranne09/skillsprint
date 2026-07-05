import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Question API endpoints
export const questionApi = {
  // Get all subjects
  getSubjects: () => api.get('/questions/subjects'),
  
  // Get topics for a subject
  getTopics: (subject) => api.get(`/questions/topics/${encodeURIComponent(subject)}`),
  
  // Get practice questions - FIXED: Proper parameter handling
  getPracticeQuestions: (params) => {
    const { subject, topic, subtopic, difficulty, limit } = params;
    let url = `/questions/practice?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;
    if (subtopic) url += `&subtopic=${encodeURIComponent(subtopic)}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (limit) url += `&limit=${limit}`;
    console.log('📤 API Request URL:', url);
    return api.get(url);
  },
  
  // Get question by ID
  getQuestion: (id) => api.get(`/questions/${id}`),
  
  // Search questions
  searchQuestions: (filters) => api.post('/questions/search', filters),
};

export default api;