import axios from 'axios';

const address = import.meta.env.VITE_API_URL;

export async function getCode(){
  const response = await axios.post(`${address}/auth/checkin/code`, {
      issuer: "kiosk:1", // or "kiosk"
      ttl: 20000
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

export async function ping(kioksId=1){ // 임시 값
  const res = await axios.get(`${address}/kiosk/ping?kioskId=${kioksId}`);
  return res.data;
}

export async function check_in(studentId, periodId){
  await axios.post(`${address}/users/${studentId}/attendances/check-in`, {periodId});
}

// export async function getStatus(studentId, type) {
//   try {
//     const res = await axios.get(`${address}/attendances/status/${studentId}/studying?type=${type}`);
//     return res.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

export async function getUser(studentId) {
  try{
    const res = await axios.get(`${address}/users/${studentId}`)
    return res.data;
  }catch{
    console.error(error);
    throw error;
  }
}