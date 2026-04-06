import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    TransactionRequest,
    TransactionResponse,
    TransactionFilterRequest,
    TransactionStatus,
    PagedResponse
} from "../types";

export const transactionApi = {
    // CREATE
    create: (data: TransactionRequest) =>
        apiCall<ApiResponse<TransactionResponse>>(
            apiClient.post("/transactions", data)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<TransactionResponse>>(
            apiClient.get(`/transactions/${id}`)
        ),

    // REFUND
    refund: (id: string) =>
        apiCall<ApiResponse<TransactionResponse>>(
            apiClient.put(`/transactions/${id}/refund`)
        ),

    // UPDATE STATUS
    updateStatus: (id: string, status: TransactionStatus) =>
        apiCall<ApiResponse<TransactionResponse>>(
            apiClient.put(`/transactions/${id}/status`, status)
        ),

    // GET ALL
    getAll: (params: TransactionFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<TransactionResponse>>>(
            apiClient.get("/transactions", { params })
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/transactions/${id}`)
        ),
};