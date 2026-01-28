import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UpsertOverrideSchedule,
  GetOverrideSchedules,
  DeleteOverrideSchedule,
} from '../api/AcademicCalendarAPI';
import dayjs from 'dayjs';

// Query Keys
export const overrideKeys = {
  all: ['overrides'],
  lists: () => [...overrideKeys.all, 'list'],
  list: (filters) => [...overrideKeys.lists(), filters],
  month: (year, month) => [...overrideKeys.lists(), 'month', year, month],
  range: (dateFrom, dateTo) => [
    ...overrideKeys.lists(),
    'range',
    dateFrom,
    dateTo,
  ],
};

/**
 * 특정 월의 Override Schedule 조회 훅
 * @param {number} year - 년도
 * @param {number} month - 월 (1-12)
 */
export function useOverridesByMonth(year, month, options = {}) {
  // 해당 월의 시작일과 종료일 계산
  const dateFrom = dayjs(`${year}-${month.toString().padStart(2, '0')}-01`)
    .startOf('month')
    .format('YYYY-MM-DD');
  const dateTo = dayjs(`${year}-${month.toString().padStart(2, '0')}-01`)
    .endOf('month')
    .format('YYYY-MM-DD');

  return useQuery({
    queryKey: overrideKeys.month(year, month),
    queryFn: async () => {
      const response = await GetOverrideSchedules({
        date_from: dateFrom,
        date_to: dateTo,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분 - 달 단위로 더 오래 캐싱
    enabled: !!(year && month), // year와 month가 있을 때만 실행
    ...options,
  });
}

/**
 * 날짜 범위로 Override Schedule 조회 훅
 * @param {string} dateFrom - 시작 날짜 (YYYY-MM-DD)
 * @param {string} dateTo - 종료 날짜 (YYYY-MM-DD)
 */
export function useOverridesByRange(dateFrom, dateTo, options = {}) {
  return useQuery({
    queryKey: overrideKeys.range(dateFrom, dateTo),
    queryFn: async () => {
      const response = await GetOverrideSchedules({
        date_from: dateFrom,
        date_to: dateTo,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
    enabled: !!(dateFrom && dateTo),
    ...options,
  });
}

/**
 * 모든 Override Schedule 조회 훅
 */
export function useOverridesAll(options = {}) {
  return useQuery({
    queryKey: overrideKeys.lists(),
    queryFn: async () => {
      const response = await GetOverrideSchedules({});
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Override Schedule 생성/수정 훅 (Upsert)
 */
export function useUpsertOverride(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleData) => {
      const response = await UpsertOverrideSchedule(scheduleData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 모든 Override 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: overrideKeys.lists() });

      // 해당 날짜가 속한 월의 캐시 무효화
      if (variables.date) {
        const date = dayjs(variables.date);
        const year = date.year();
        const month = date.month() + 1;
        queryClient.invalidateQueries({
          queryKey: overrideKeys.month(year, month),
        });
      }

      options.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error('Override Schedule 저장 실패:', error);
      options.onError?.(error);
    },
  });
}

/**
 * Override Schedule 삭제 훅
 */
export function useDeleteOverride(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId) => {
      const response = await DeleteOverrideSchedule(scheduleId);
      return response.data;
    },
    onSuccess: (data, scheduleId) => {
      // 모든 Override 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: overrideKeys.lists() });

      options.onSuccess?.(data, scheduleId);
    },
    onError: (error) => {
      console.error('Override Schedule 삭제 실패:', error);
      options.onError?.(error);
    },
  });
}

/**
 * Override 관련 모든 훅을 하나로 묶은 통합 훅
 * @param {Object} options - 옵션
 * @param {number} options.year - 조회할 연도
 * @param {number} options.month - 조회할 월
 * @param {string} options.dateFrom - 시작 날짜
 * @param {string} options.dateTo - 종료 날짜
 * @param {boolean} options.useMonth - 월 단위 조회 사용 여부 (기본값: true)
 */
export function useOverride(options = {}) {
  const {
    year = dayjs().year(),
    month = dayjs().month() + 1,
    dateFrom,
    dateTo,
    useMonth = true,
  } = options;

  // 월 단위 또는 범위 단위 조회 선택
  const overridesByMonth = useOverridesByMonth(year, month, {
    enabled: useMonth && !dateFrom && !dateTo,
  });

  const overridesByRange = useOverridesByRange(dateFrom, dateTo, {
    enabled: !useMonth && !!(dateFrom && dateTo),
  });

  const upsertOverride = useUpsertOverride();
  const deleteOverride = useDeleteOverride();

  // 사용 중인 쿼리 결정
  const activeQuery = useMonth ? overridesByMonth : overridesByRange;

  return {
    // 데이터
    overrides: activeQuery.data || [],
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,

    // Mutation
    upsertOverride: upsertOverride.mutate,
    deleteOverride: deleteOverride.mutate,

    // Mutation 상태
    isUpserting: upsertOverride.isPending,
    isDeleting: deleteOverride.isPending,

    // 유틸리티
    refetch: activeQuery.refetch,
  };
}

/**
 * 여러 달의 Override Schedule을 한번에 조회하는 훅
 * @param {Array<{year: number, month: number}>} months - 조회할 년월 배열
 */
export function useOverridesMultipleMonths(months = [], options = {}) {
  const queries = months.map(({ year, month }) =>
    useOverridesByMonth(year, month, options),
  );

  return {
    queries,
    allOverrides: queries.flatMap((q) => q.data || []),
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
    errors: queries.filter((q) => q.isError).map((q) => q.error),
  };
}
