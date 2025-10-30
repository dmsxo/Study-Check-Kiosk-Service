import { axios } from 'axios';
import { userData } from '../test/userData';

const address = "http://localhost:3000";

export async function getCode() {
  const response = await axios.post(`${address}/auth/checkin/code`, {
    issuer: `student:${userData.studentID}`,
    ttl:10000
  });
  return response.data;
}

export async function verifyCode(code) {
  try {
    const response = await axios.post(`${address}/auth/checkin/verify`, {
      code: code
    });
    return response.data;
  } catch (error) {
    console.error("Verify failed", error);
    throw error;
  }
}