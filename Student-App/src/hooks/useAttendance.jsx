import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttendances } from "../api/AttendanceAPI";
import { getFullStatData } from "../helpers/stats.helper";

function processAttendance(raw) {
  const full = getFullStatData(raw);
  return {
    attendances_morning: full.morning,
    attendances_night: full.night,
  };
}

export function useAttendance() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const res = await getAttendances();
      return res;
    },
    select: (data) => {
      const processed = processAttendance(data);
      return processed;
    },
    staleTime: Infinity, // 자동 refetch 없음 (원할 때만!)
    retry: 1, // 에러 시 1번만 재시도
  });
  const refresh = async () => {
    await queryClient.invalidateQueries(["attendance"]);
  };

  return {
    ...query,
    refresh,
  };
}
