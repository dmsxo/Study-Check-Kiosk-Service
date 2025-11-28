import axios from 'axios'

const api = axios.create({
  baseURL: 'http://daein.mcv.kr:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
});

export default api;