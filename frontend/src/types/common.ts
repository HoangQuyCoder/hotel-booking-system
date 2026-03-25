/**
 * Interface: Common paging structure for API responses
 */
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Interface: Request base filter
 */
export interface BaseFilterRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  isActive?: boolean;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
}

/**
 * Interface: Entity base
 */
export interface BaseEntity {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
