import { getMyRegistrations, getPrograms } from '../api/applicationAPI';

export async function transformPeriods(){
  const registrations = await getMyRegistrations();
  const periods = await getPrograms();

  console.log(periods);
}