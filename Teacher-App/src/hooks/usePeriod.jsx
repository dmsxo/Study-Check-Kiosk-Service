import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreatePeriod,
  UpdatePeriod,
  GetPeriods,
  DeletePeriod,
} from '../api/AcademicCalendarAPI';

// Query Keys
export const periodKeys = {
  all: ['periods'],
  lists: () => [...periodKeys.all, 'list'],
  list: (filters) => [...periodKeys.lists(), filters],
  details: () => [...periodKeys.all, 'detail'],
  detail: (id) => [...periodKeys.details(), id],
};

/**
 * Period 목록 조회 훅
 */
export function usePeriods(options = {}) {
  return useQuery({
    queryKey: periodKeys.lists(),
    queryFn: async () => {
      const response = await GetPeriods();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
    ...options,
  });
}

/**
 * Period 생성 훅
 */
export function useCreatePeriod(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (periodData) => {
      const response = await CreatePeriod(periodData);
      return response.data;
    },
    onSuccess: (data) => {
      // Period 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: periodKeys.lists() });

      // 성공 콜백
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Period 생성 실패:', error);
      options.onError?.(error);
    },
  });
}

/**
 * Period 수정 훅
 */
export function useUpdatePeriod(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (periodData) => {
      const response = await UpdatePeriod(periodData);
      return response.data;
    },
    onSuccess: (data) => {
      // Period 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: periodKeys.lists() });

      // 특정 Period 상세 캐시 무효화 (있다면)
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: periodKeys.detail(data.id) });
      }

      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Period 수정 실패:', error);
      options.onError?.(error);
    },
  });
}

/**
 * Period 삭제 훅
 */
export function useDeletePeriod(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (periodId) => {
      const response = await DeletePeriod(periodId);
      return response.data;
    },
    onSuccess: (data, periodId) => {
      // Period 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: periodKeys.lists() });

      // 삭제된 Period 상세 캐시 제거
      queryClient.removeQueries({ queryKey: periodKeys.detail(periodId) });

      options.onSuccess?.(data, periodId);
    },
    onError: (error) => {
      console.error('Period 삭제 실패:', error);
      options.onError?.(error);
    },
  });
}

/**
 * Period 관련 모든 훅을 하나로 묶은 통합 훅
 */
export function usePeriod() {
  const periods = usePeriods();
  const createPeriod = useCreatePeriod();
  const updatePeriod = useUpdatePeriod();
  const deletePeriod = useDeletePeriod();

  return {
    // 데이터
    periods: periods.data || [],
    isLoading: periods.isLoading,
    isError: periods.isError,
    error: periods.error,

    // Mutation
    createPeriod: createPeriod.mutate,
    updatePeriod: updatePeriod.mutate,
    deletePeriod: deletePeriod.mutate,

    // Mutation 상태
    isCreating: createPeriod.isPending,
    isUpdating: updatePeriod.isPending,
    isDeleting: deletePeriod.isPending,

    // 유틸리티
    refetch: periods.refetch,
  };
}
