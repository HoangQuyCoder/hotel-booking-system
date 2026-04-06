import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    NotificationTemplateRequest,
    NotificationTemplateResponse,
    NotificationTemplateFilterRequest,
    NotificationLogResponse,
    NotificationLogFilterRequest,
    PagedResponse
} from "../types";

export const notificationApi = {
    // ================= TEMPLATE =================

    createTemplate: (data: NotificationTemplateRequest) =>
        apiCall<ApiResponse<NotificationTemplateResponse>>(
            apiClient.post("/notifications/templates", data)
        ),

    getTemplateById: (id: string) =>
        apiCall<ApiResponse<NotificationTemplateResponse>>(
            apiClient.get(`/notifications/templates/${id}`)
        ),

    updateTemplate: (id: string, data: NotificationTemplateRequest) =>
        apiCall<ApiResponse<NotificationTemplateResponse>>(
            apiClient.put(`/notifications/templates/${id}`, data)
        ),

    deleteTemplate: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/notifications/templates/${id}`)
        ),

    getAllTemplates: (params: NotificationTemplateFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<NotificationTemplateResponse>>>(
            apiClient.get("/notifications/templates", { params })
        ),

    // ================= LOG =================

    getLogById: (id: string) =>
        apiCall<ApiResponse<NotificationLogResponse>>(
            apiClient.get(`/notifications/logs/${id}`)
        ),

    getMyLogs: (userId?: string) =>
        apiCall<ApiResponse<NotificationLogResponse[]>>(
            apiClient.get("/notifications/logs", {
                params: userId ? { userId } : {},
            })
        ),

    getAllLogs: (params: NotificationLogFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<NotificationLogResponse>>>(
            apiClient.get("/notifications/logs/all", { params })
        ),
};