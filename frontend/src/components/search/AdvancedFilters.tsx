import { Button } from "../ui/Button";
import { X } from "lucide-react";

export interface AdvancedFiltersProps {
  filters: SearchFilters;
  onChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K] | undefined
  ) => void;
  onClear: () => void;
  onClose: () => void;
}

export interface SearchFilters {
  city?: string;
  minRating?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onChange,
  onClear,
  onClose,
}) => {
  return (
    <div className="border-top pt-3 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Bộ lọc nâng cao</h6>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          icon={<X size={16} />}
        />
      </div>

      <div className="row g-3">
        {/* Rating tối thiểu */}
        <div className="col-md-4">
          <label className="form-label small">Rating tối thiểu</label>
          <select
            className="form-select form-select-sm"
            value={filters.minRating?.toString() || ""}
            onChange={(e) =>
              onChange(
                "minRating",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">Tất cả</option>
            <option value="3">3+ sao</option>
            <option value="4">4+ sao</option>
            <option value="4.5">4.5+ sao</option>
          </select>
        </div>

        {/* Giá tối đa */}
        <div className="col-md-4">
          <label className="form-label small">Giá tối đa</label>
          <select
            className="form-select form-select-sm"
            value={filters.maxPrice?.toString() || ""}
            onChange={(e) =>
              onChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">Không giới hạn</option>
            <option value="1000000">Dưới 1 triệu</option>
            <option value="2000000">Dưới 2 triệu</option>
            <option value="5000000">Dưới 5 triệu</option>
          </select>
        </div>

        {/* Trạng thái hoạt động */}
        <div className="col-md-4">
          <label className="form-label small">Trạng thái hoạt động</label>
          <select
            className="form-select form-select-sm"
            value={filters.isActive?.toString() || ""}
            onChange={(e) => {
              const val = e.target.value;
              onChange("isActive", val === "" ? undefined : val === "true");
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
};
