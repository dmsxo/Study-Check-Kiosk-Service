import axios from 'axios';

const address = "http://localhost:3000";

export async function getCode(){
  const response = await axios.post(`${address}/auth/checkin/code`, {
      issuer: "kiosk:night", // or "kiosk"
      ttl: 15000
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