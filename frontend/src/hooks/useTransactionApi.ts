import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { transactionApi } from "../api/transactionApi";
import type {
    TransactionFilterRequest,
    TransactionStatus,
} from "../types";

const TRANSACTIONS_KEY = ["transactions"];
const TRANSACTION_KEY = ["transaction"];

export const useTransactionApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useTransactions = (params: TransactionFilterRequest) =>
        useQuery({
            queryKey: [...TRANSACTIONS_KEY, params],
            queryFn: () => transactionApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useTransactionById = (id: string) =>
        useQuery({
            queryKey: [...TRANSACTION_KEY, id],
            queryFn: () => transactionApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createTransaction = useMutation({
        mutationFn: transactionApi.create,

        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        },
    });

    // ================= REFUND =================
    const refundTransaction = useMutation({
        mutationFn: (id: string) => transactionApi.refund(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...TRANSACTION_KEY, id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        },
    });

    // ================= UPDATE STATUS =================
    const updateTransactionStatus = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: TransactionStatus;
        }) => transactionApi.updateStatus(id, status),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...TRANSACTION_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        },
    });

    // ================= DELETE =================
    const deleteTransaction = useMutation({
        mutationFn: (id: string) => transactionApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.removeQueries({ queryKey: [...TRANSACTION_KEY, id] });
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
        },
    });

    return {
        useTransactions,
        useTransactionById,
        createTransaction,
        refundTransaction,
        updateTransactionStatus,
        deleteTransaction,
    };
};