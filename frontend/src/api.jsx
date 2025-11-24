import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5174', // Adjust the base URL as needed
  withCredentials: true,
});

export default api;