import api from "./Instance";

// Periods
export async function CreatePeriod(period){
  const schedules = period.schedules.map(s => ({
    grade: Number(s.grade),
    weekday: s.weekday,
    isOpen: Boolean(s.isOpen),
  }));

  const capacities = period.capacities.map(c => ({
    grade: Number(c.grade),
    capacity: Number(c.capacity),
  }));

  const payload = {
    name: period.name,
    description: period.description,
    registration: {
      start: period.registration.start,
      end: period.registration.end,
    },
    additionalRegistration: period.additionalRegistration,
    operation: {
      start: period.operation.start,
      end: period.operation.end,
    },
    dailyOperation: {
      start: period.dailyOperation.start,
      end: period.dailyOperation.end,
    },
    capacities: capacities,
    schedules: schedules,
  }
  console.log('period payload:', payload);
  try{
    return await api.post('/study-period', payload);
  }
  catch (error){
    throw error;
  }
}

export async function UpdatePeriod(period){
  const schedules = period.schedules.map(s => ({
    grade: Number(s.grade),
    weekday: s.weekday,
    isOpen: Boolean(s.isOpen),
  }));

  const capacities = period.capacities.map(c => ({
    grade: Number(c.grade),
    capacity: Number(c.capacity),
  }));

  const payload = {
    name: period.name,
    description: period.description,
    registration: {
      start: period.registration.start,
      end: period.registration.end,
    },
    additionalRegistration: period.additionalRegistration,
    operation: {
      start: period.operation.start,
      end: period.operation.end,
    },
    dailyOperation: {
      start: period.dailyOperation.start,
      end: period.dailyOperation.end,
    },
    capacities: capacities,
    schedules: schedules,
  }

  console.log('period payload:', payload);
  try{
    return await api.patch(`/study-period/${period.id}`, payload);
  }
  catch (error){
    throw error;
  }
}

  export async function GetPeriods(){
    try{
    return await api.get('/study-period?relation=true');
  }
  catch (error){
    throw error;
  }
}

export async function DeletePeriod(id){
  try{
    return await api.delete(`/study-period/${id}`)
  }
  catch (error){
    throw error;
  }
}

//Override Schedule
export async function UpsertOverrideSchedule(schedule){
  const payload = {
    date: schedule.date,
    descriptions: schedule.descriptions,
    mappings: schedule.mappings.map(m => ({
      periodId: m.periodId,
      grade: m.grade,
      isOpen: m.isOpen,
    })),
  }
  console.log('override payload:', payload);
  try{
    return await api.post('/overrides', payload)
  }
  catch (error){
    throw error;
  }
}


export async function GetOverrideSchedules(query){
  try{
    return await api.get('/overrides', { params: query });
  }
  catch (error){
    throw error;
  }
}

export async function DeleteOverrideSchedule(id){
  try{
    return await api.delete(`/overrides/${id}`);
  }
  catch (error){
    throw error;
  }
}