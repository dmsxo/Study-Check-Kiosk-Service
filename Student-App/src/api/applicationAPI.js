import api from "./Instance";

export async function getPrograms() {
  try{
    const periods = await api.get(`/me/periods`);
    return periods.data;
  }
  catch (e){
    console.log(e);
  }
}

export async function getMyRegistrations() {
  try{
    const registrations = await api.get('/me/registrations')
    return registrations.data;
  }
  catch (e){
    console.error(e);
  }
}

export async function applicationPeriod(periodId) {
  try{
    const registration = await api.post(`me/application/${periodId}`);
    console.log(registration);
    return registration;
  }
  catch (e){
    console.error(e);
  }
}