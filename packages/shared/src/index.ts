// 共享类型和工具函数
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const createSuccessResponse = <T>(data: T, message = 'ok'): ApiResponse<T> => ({
  code: 200,
  data,
  message,
  success: true,
});

export const createErrorResponse = (message: string, code = 500): ApiResponse<null> => ({
  code,
  data: null,
  message,
  success: false,
});
