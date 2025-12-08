import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSales = async (params) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sales data');
  }
};

export const getFilterOptions = async () => {
  try {
    const response = await api.get('/filter-options');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch filter options');
  }
};

export const getStatistics = async (params) => {
  try {
    const response = await api.get('/statistics', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};

export default api;
