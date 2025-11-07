import axios  from 'axios';
import { userData } from '../test/userData';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  withCredentials: true,

});


export async function getCode() {
  return await api.post(`/auth/checkin/code`, {
    issuer: `student:${userData.studentID}`,
    ttl:10000
  }). then((response) => {
    return response.data;
  }).catch((error) => {
    console.error("Code fetch failed", error);
    throw error;
  });
}

export async function verifyCode(code) {
  return await api.post(`/auth/checkin/verify`, {
    code: code
  }). then((response) => {
    return response.data;
  }).catch((error) => {
    console.error("Verify failed", error);
    throw error;
  });
}

export async function login_session(email){
  return api.post(`/auth/login`, {
    email: email
  }). then((response) => {
    return response.data;
  }).catch((error) => {  console.error("Login failed", error);
    throw error;
  });
}

export async function logout_session(){
  return api.post(`/auth/logout`).then((response) => { 
    return response.data;
  }).catch((error) => {
    console.error("Logout failed", error);
    throw error;
  });
}

export async function checkSession(){
  return await api.get(`/me`).then((response) => {
    console.log(response)
    return response.data;
  }).catch((error) => {
    console.error("Session check failed", error);
    throw error;
  });
}

export async function check_in(type){
  return await api.post(`/me/attendances/check-in?type=${type}`);
}

export async function pong(kioskId, studentId){
  return await api.post(`/kiosk/pong?kioskId=${kioskId}&studentId=${studentId}`);
}

export async function check_out(type, description){
  return await api.post(`/me/attendances/check-out?type=${type}&description=${description}`);
}

export async function getStatus(type) {
  return await api.get(`/me/attendances/current?type=${type}`).then((response) => {
    return response.data;
  }).catch((error) => {
    console.error(error);
    throw error;
  });
}

export async function getAttendances() {
  return await api.get(`/me/attendances`).then((response) => {
    return response.data;
  }).catch((error) => {
    console.error(error);
    throw error;
  });
}