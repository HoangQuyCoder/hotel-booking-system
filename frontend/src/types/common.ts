/**
 * Interface: Cấu trúc phân trang chung cho API response
 */
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Interface: Dạng response chuẩn từ API (có thể dùng cho non-paged)
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  timestamp?: string;
}

/**
 * Interface: Request filter cơ bản
 * Dùng để truyền params phân trang và sắp xếp.
 */
export interface BaseFilterRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  keyword?: string;
}

/**
 * Interface: Audit fields
 */
export interface Auditable {
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface: Entity base
 */
export interface BaseEntity extends Auditable {
  id: string;
  isActive: boolean;
}
