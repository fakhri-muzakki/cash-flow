// app/dashboard/hooks/useTransactions.ts
"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";
import type { Transaction, TransactionType, FilterType } from "./type";
import { useState } from "react";

// ============================================================
// 1. API Functions with filter parameters
// ============================================================

interface FetchTransactionsParams {
  token: string;
  filter: FilterType;
  customDate?: Date;
  page: number; // ← Tambahkan
  limit: number; // ← Tambahkan
}

const fetchTransactions = async ({
  token,
  filter,
  customDate,
  page, // ← Tambahkan parameter
  limit, // ← Tambahkan parameter
}: FetchTransactionsParams) => {
  let url = "http://localhost:8080/api/transactions";
  const params = new URLSearchParams();

  // ← TAMBAHKAN: Pagination params
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // Rest of filter logic (same as before)
  if (filter === "custom" && customDate) {
    const dateStr = format(customDate, "yyyy-MM-dd");
    params.append("period", "custom");
    params.append("date_start", dateStr);
    params.append("date_end", dateStr);
  } else if (filter !== "all") {
    const periodMap: Record<string, string> = {
      today: "today",
      thisWeek: "week",
      thisMonth: "month",
      thisYear: "year",
    };
    params.append("period", periodMap[filter] || filter);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to fetch transactions");
  }

  const result = await response.json();
  console.log("Pagination from backend:", result);

  const pagination = result.meta
    ? {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total_items,
        totalPages: result.meta.total_pages,
        hasNextPage: result.meta.page < result.meta.total_pages,
        hasPrevPage: result.meta.page > 1,
      }
    : {
        page,
        limit,
        total: result.data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

  // ← UBAH: Return object dengan data dan pagination info
  return {
    data: result.data.map((item: Transaction) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      note: item.note,
      date: format(new Date(item.date), "yyyy-MM-dd"),
    })),
    pagination: pagination,
  };
};

const createTransaction = async ({
  token,
  type,
  amount,
  note,
  date,
}: {
  token: string;
  type: TransactionType;
  amount: number;
  note: string;
  date: string;
}) => {
  const response = await fetch("http://localhost:8080/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, amount, note, date }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal menambah transaksi");
  }
  return response.json();
};

const updateTransactionAPI = async ({
  token,
  id,
  amount,
  note,
  date,
}: {
  token: string;
  id: string;
  amount: number;
  note: string;
  date: string;
}) => {
  const response = await fetch(`http://localhost:8080/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, note, date }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mengupdate transaksi");
  }
  return response.json();
};

const deleteTransactionAPI = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  const response = await fetch(`http://localhost:8080/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus transaksi");
  }
  return response.json();
};

// ============================================================
// 2. The Main Hook (with filter state)
// ============================================================

const ITEMS_PER_PAGE = 4;
export function useTransactions() {
  const { token, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Filter state
  const [filter, setFilter] = useState<FilterType>("all");
  const [customDate, setCustomDate] = useState<Date | undefined>();

  // ==================== QUERY: Get transactions with filters ====================
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingTransactions,
    isFetching,
    error: fetchError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["transactions", filter, customDate],
    queryFn: ({ pageParam = 1 }) =>
      fetchTransactions({
        token: token!,
        filter,
        customDate,
        page: pageParam,
        limit: ITEMS_PER_PAGE,
      }),
    getNextPageParam: (lastPage) => {
      console.log(
        "hasNextPage from lastPage:",
        lastPage?.pagination?.hasNextPage,
      );

      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isHydrated && isAuthenticated && !!token,
  });

  // ← TAMBAHKAN: flatten transactions dari semua pages
  // const transactions = data?.pages.flatMap((page) => page.data) ?? [];
  const transactions =
    data?.pages
      .flatMap((page) => page.data)
      .filter(
        (tx, index, self) => self.findIndex((t) => t.id === tx.id) === index,
      ) ?? [];

  const hasMore = hasNextPage;
  const isFetchingMore = isFetchingNextPage;

  // ==================== MUTATIONS (sama seperti sebelumnya) ====================
  const addMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", filter, customDate],
      });
      toast.success("Transaksi berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambah transaksi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransactionAPI,
    onMutate: async ({ id, amount, note, date }) => {
      await queryClient.cancelQueries({
        queryKey: ["transactions", filter, customDate],
      });
      const previousTransactions = queryClient.getQueryData([
        "transactions",
        filter,
        customDate,
      ]);
      queryClient.setQueryData(
        ["transactions", filter, customDate],
        (old: Transaction[] | undefined) => {
          if (!old) return [];
          return old.map((transaction) =>
            transaction.id === id
              ? { ...transaction, amount, note, date }
              : transaction,
          );
        },
      );
      return { previousTransactions };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions", filter, customDate],
          context.previousTransactions,
        );
      }
      toast.error(error.message || "Gagal mengupdate transaksi");
    },
    onSuccess: () => {
      toast.success("Transaksi berhasil diupdate");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", filter, customDate],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionAPI,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["transactions", filter, customDate],
      });
      const previousTransactions = queryClient.getQueryData([
        "transactions",
        filter,
        customDate,
      ]);
      queryClient.setQueryData(
        ["transactions", filter, customDate],
        (old: Transaction[] | undefined) => {
          if (!old) return [];
          return old.filter((transaction) => transaction.id !== id);
        },
      );
      return { previousTransactions };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions", filter, customDate],
          context.previousTransactions,
        );
      }
      toast.error(error.message || "Gagal menghapus transaksi");
    },
    onSuccess: () => {
      toast.success("Transaksi berhasil dihapus");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", filter, customDate],
      });
    },
  });

  // ==================== Wrapper functions ====================
  const addTransaction = (
    type: TransactionType,
    data: { amount: number; note: string; date: string },
  ) => {
    addMutation.mutate({ token: token!, type, ...data });
  };

  const updateTransaction = (
    id: string,
    data: { amount: number; note: string; date: string },
  ) => {
    updateMutation.mutate({ token: token!, id, ...data });
  };

  const deleteTransaction = (id: string) => {
    deleteMutation.mutate({ token: token!, id });
  };

  // ==================== Redirect ====================
  if (isHydrated && !isAuthenticated) {
    router.push("/login");
  }

  const isLoading =
    isLoadingTransactions ||
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    // Data
    transactions, // ← SUDAH BERUBAH (dari data.pages)
    hasMore, // ← TAMBAHKAN
    isFetchingMore, // ← TAMBAHKAN

    // Filter state (same)
    filter,
    setFilter,
    customDate,
    setCustomDate,

    // Loading & Error states
    isLoading,
    isFetching,
    error: fetchError,

    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadMore: fetchNextPage, // ← TAMBAHKAN (alias)
    refetchTransactions: refetch,
  };
}
