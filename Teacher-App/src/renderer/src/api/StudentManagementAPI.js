import api from './Instance';

export async function getUserByFilter(studyType, activeFrom, activeTo){
  try{
    const periods = await api.get(`study-period?study_type=${studyType}&active_from=${activeFrom}&active_to=${activeTo}&relation=true`)
    
    const students = [];

    periods.data.forEach(item => {
      if (item.registrations && item.registrations.length > 0) {
        item.registrations.forEach(reg => {
          if (reg.student) {
            students.push(reg.student);
          }
        });
      }
    });
    console.log(students);
    return students;
  }catch(e){
    console.log(e);
    return e;
  }
}