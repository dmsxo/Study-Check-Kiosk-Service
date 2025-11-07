import axios from 'axios';

const address = "http://localhost:3000";

export async function getCode(){
  const response = await axios.post(`${address}/auth/checkin/code`, {
      issuer: "kiosk:night-1", // or "kiosk"
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

export async function ping(kioksId="night-1"){ // 임시 값
  const res = await axios.get(`${address}/kiosk/ping?kioskId=${kioksId}`);
  return res.data;
}

export async function check_in(student_id, type){
  await axios.post(`${address}/users/${student_id}/attendances/check-in?type=${type}`);
}

// export async function getStatus(student_id, type) {
//   try {
//     const res = await axios.get(`${address}/attendances/status/${student_id}/studying?type=${type}`);
//     return res.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

export async function getUser(student_id) {
  try{
    const res = await axios.get(`${address}/users/${student_id}`)
    return res.data;
  }catch{
    console.error(error);
    throw error;
  }
}