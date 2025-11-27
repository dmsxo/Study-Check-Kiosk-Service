import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      console.error("서버 연결 실패!", err.message);
      if (window.location.pathname !== '/server-not-connected'){
        window.location.href = '/server-not-connected';
      }
    } else {
      if (err.response.status === 401) {
        if (window.location.pathname !== '/login')
          window.location.href = '/login';
        return;
      }
    }
    return Promise.reject(err);
  }
);

export default api;