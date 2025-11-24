import api from "./Instance";

export async function getPrograms() {
  try{
    const periods = await api.get(`/me/periods`);
    return periods;
  }
  catch (e){
    console.log(e);
  }
}

export async function getMyRegistrations() {
  try{
    const registrations = await api.get('/me/registrations')
    return registrations;
  }
  catch (e){
    console.log(e);
  }
}