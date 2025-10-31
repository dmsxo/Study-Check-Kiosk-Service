import axios from 'axios';

const address = "http://localhost:3000";

export async function getCode(){
  const response = await axios.post(`${API_BASE}/auth/checkin/code`, {
      mode: "kiosk:0", // or "kiosk"
    });
    return response.data; // { code, expiresIn }
}

export async function verifyCode(code){
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