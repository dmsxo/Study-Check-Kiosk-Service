export interface StudyCacheStatus {
  attendance_id: number;
  isStudy: boolean;
  start_time: string;
  end_time: string;
  isAutoCheckOut?: boolean;
}
