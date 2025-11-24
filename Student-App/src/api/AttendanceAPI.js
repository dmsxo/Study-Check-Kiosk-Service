import api from './Instance'

export async function getCode(studentId) {
  try {
    const response = await api.post(`/auth/checkin/code`, {
      issuer: `student:${studentId}`,
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

export async function login_session(/*email */studentId) {
  try {
    const response = await api.post(`/auth/login`, {
      // email: email
      studentId: studentId
    });
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

// export async function login_session(email) {
//   try {
//     const response = await api.post(`/auth/login`, {
//       email: email
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Login failed", error);
//     throw error;
//   }
// }

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

export async function check_in(periodId) {
  try {
    return await api.post(`/me/attendances/check-in`, {periodId});
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

export async function check_out(description) {
  try {
    return await api.post(`/me/attendances/check-out`, {description});
  } catch (error) {
    throw error;
  }
}

export async function getStatus() {
  try {
    const response = await api.get(`/me/attendances/current`);
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
