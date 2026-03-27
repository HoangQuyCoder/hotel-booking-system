import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { notificationApi } from "../api/notificationApi";
import type {
    NotificationTemplateRequest,
    NotificationTemplateFilterRequest,
    NotificationLogFilterRequest,
} from "../types";

const TEMPLATE_KEY = ["notificationTemplates"];
const TEMPLATE_DETAIL_KEY = ["notificationTemplate"];
const LOG_KEY = ["notificationLogs"];
const LOG_DETAIL_KEY = ["notificationLog"];

export const useNotificationApi = () => {
    const queryClient = useQueryClient();

    // ================= TEMPLATE =================

    const useTemplates = (params: NotificationTemplateFilterRequest) =>
        useQuery({
            queryKey: [...TEMPLATE_KEY, params],
            queryFn: () => notificationApi.getAllTemplates(params),
            select: (res) => res.data,
        });

    const useTemplateById = (id: string) =>
        useQuery({
            queryKey: [...TEMPLATE_DETAIL_KEY, id],
            queryFn: () => notificationApi.getTemplateById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    const createTemplate = useMutation({
        mutationFn: notificationApi.createTemplate,
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: TEMPLATE_KEY });
        },
    });

    const updateTemplate = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: NotificationTemplateRequest;
        }) => notificationApi.updateTemplate(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...TEMPLATE_DETAIL_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: TEMPLATE_KEY });
        },
    });

    const deleteTemplate = useMutation({
        mutationFn: (id: string) => notificationApi.deleteTemplate(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.removeQueries({
                queryKey: [...TEMPLATE_DETAIL_KEY, id],
            });

            queryClient.invalidateQueries({ queryKey: TEMPLATE_KEY });
        },
    });

    // ================= LOG =================

    const useMyLogs = (userId?: string) =>
        useQuery({
            queryKey: [...LOG_KEY, userId],
            queryFn: () => notificationApi.getMyLogs(userId),
            select: (res) => res.data,
        });

    const useLogById = (id: string) =>
        useQuery({
            queryKey: [...LOG_DETAIL_KEY, id],
            queryFn: () => notificationApi.getLogById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    const useAllLogs = (params: NotificationLogFilterRequest) =>
        useQuery({
            queryKey: [...LOG_KEY, "all", params],
            queryFn: () => notificationApi.getAllLogs(params),
            select: (res) => res.data,
        });

    return {
        // templates
        useTemplates,
        useTemplateById,
        createTemplate,
        updateTemplate,
        deleteTemplate,

        // logs
        useMyLogs,
        useLogById,
        useAllLogs,
    };
};