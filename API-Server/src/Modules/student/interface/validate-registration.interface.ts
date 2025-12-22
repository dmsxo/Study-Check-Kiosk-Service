import { StudyType } from 'src/common/enums/study-type.enum';

export interface RegistrationValidation {
  type: StudyType;
  startTimeStr: string;
  endTimeStr: string;
}
