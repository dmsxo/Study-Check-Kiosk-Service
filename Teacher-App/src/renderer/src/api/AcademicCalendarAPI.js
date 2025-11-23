import api from "./Instance";

// Periods
export async function CreatePeriod(period){
  const periodWithoutId = (({ id, ...rest }) => rest)(period);
  try{
    return await api.post('/study-period', periodWithoutId);
  }
  catch (error){
    throw error;
  }
}

export async function UpdatePeriod(period){
  const periodWithoutId = (({ id, ...rest }) => rest)(period);
  try{
    return await api.patch('/study-period', periodWithoutId);
  }
  catch (error){
    throw error;
  }
}

export async function GetPeriods(){
  try{
    return await api.get('/study-period')
  }
  catch (error){
    throw error;
  }
}

export async function DeletePeriod(turm_id, type){
  try{
    return await api.delete(`/study-period?term_id=${turm_id}&study_type=${type}`)
  }
  catch (error){
    throw error;
  }
}

// Default Schedule
export async function GetDefaultSchedule(){
  try{
    return await api.get('/schedule/default')
  }
  catch (error){
    throw error;
  }
}

export async function UpdateDefaultSchedule(schedule){
  try{
    return await api.patch('/schedule/default', schedule)
  }
  catch (error){
    throw error;
  }
}

//Override Schedule
export async function CreateOverrideSchedule(schedule){
  const scheduleWithoutId = (({ id, ...rest }) => rest)(schedule);
  try{
    return await api.post('/schedule/override', scheduleWithoutId)
  }
  catch (error){
    throw error;
  }
}

export async function UpdateOverrideSchedule(schedule){
  const scheduleWithoutId = (({ id, ...rest }) => rest)(schedule);
  try{
    return await api.patch('/schedule/override', scheduleWithoutId)
  }
  catch (error){
    throw error;
  }
}

export async function GetOverrideSchedules(){
  try{
    return await api.get('/schedule/override');
  }
  catch (error){
    throw error;
  }
}

export async function DeleteOverrideScedule(date){
  try{
    return await api.delete(`/schedule/override?date=${date}`);
  }
  catch (error){
    throw error;
  }
}