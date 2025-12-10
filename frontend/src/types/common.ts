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
 * Interface: Request filter cơ bản
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
  isActive?: boolean | null;
}
