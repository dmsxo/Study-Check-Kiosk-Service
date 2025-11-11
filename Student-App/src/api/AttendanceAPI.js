import axios from 'axios';
import { userData } from '../test/userData';

const api = axios.create({
  baseURL: '/api',
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

export async function getCode(student_id) {
  try {
    const response = await api.post(`/auth/checkin/code`, {
      issuer: `student:${student_id}`,
      ttl: 10000
    });
    return response.data;
  } catch (error) {
    console.error("Code fetch failed", error);
    throw error;
  }
}

export async function verifyCode(code) {
  try {
    const response = await api.post(`/auth/checkin/verify`, {
      code: code
    });
    return response.data;
  } catch (error) {
    console.error("Verify failed", error);
    throw error;
  }
}

export async function login_session(email) {
  try {
    const response = await api.post(`/auth/login`, {
      email: email
    });
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

export async function logout_session() {
  try {
    const response = await api.post(`/auth/logout`);
    return response.data;
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
}

export async function checkSession() {
  try {
    const response = await api.get(`/me`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Session check failed", error);
    throw error;
  }
}

export async function check_in(type) {
  try {
    return await api.post(`/me/attendances/check-in?type=${type}`);
  } catch (error) {
    throw error;
  }
}

export async function pong(kioskId, studentId) {
  try {
    return await api.post(`/kiosk/pong?kioskId=${kioskId}&studentId=${studentId}`);
  } catch (error) {
    throw error;
  }
}

export async function check_out(type, description) {
  try {
    return await api.post(`/me/attendances/check-out?type=${type}&description=${description}`);
  } catch (error) {
    throw error;
  }
}

export async function getStatus(type) {
  try {
    const response = await api.get(`/me/attendances/current?type=${type}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAttendances() {
  try {
    const response = await api.get(`/me/attendances`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default api;
