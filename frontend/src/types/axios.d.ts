import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    silent?: boolean;
    showSuccess?: boolean;
  }
}
