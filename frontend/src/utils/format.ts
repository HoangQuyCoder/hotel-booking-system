import { format } from "date-fns";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (
  date: string | Date,
  fmt: string = "dd/MM/yyyy"
): string => {
  return format(new Date(date), fmt);
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
