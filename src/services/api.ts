import axios from 'axios';

const api = axios.create({
  baseURL: 'https://589b-201-20-81-230.ngrok-free.app/api/v1',
});



// Intercepta requisições para adicionar o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;