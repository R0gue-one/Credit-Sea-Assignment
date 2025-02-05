import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});


export const upload = (formData) => api.post('/upload', formData,{
  headers: { "Content-Type": "multipart/form-data" }
});
export const extract = (fileData) => api.post('/extract', fileData);
export const profile = (id) => api.get(`retrieve/${id}`);

export default api;