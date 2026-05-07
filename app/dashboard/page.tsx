"use client";

import { useState, useCallback, useRef } from "react";
import { Calendar } from "lucide-react";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import type { Transaction } from "./type";
import TransactionFormModal from "./components/TransactionFormModal";
import { useAuthStore } from "@/stores/authStore";

import Header from "./components/Header";
import TransactionWrapper from "./components/TransactionWrapper";
import FilterSection from "./components/FilterSection";
import Stats from "./components/Stats";

import { useTransactions } from "./useTransactions";
import { calculateTotals, groupByDate } from "./transactionUtils";
import LoadingModal from "./components/LoadingModal";

const filterOptions = [
  { value: "all", label: "Semua Transaksi" },
  { value: "today", label: "Hari Ini" },
  { value: "thisWeek", label: "Minggu Ini" },
  { value: "thisMonth", label: "Bulan Ini" },
  { value: "thisYear", label: "Tahun Ini" },
];

// Main Dashboard Component
export default function DashboardPage() {
  const { isHydrated } = useAuthStore();
  const {
    transactions,
    isLoading,
    hasMore,
    isFetchingMore,
    filter,
    setFilter,
    customDate,
    setCustomDate,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadMore,
  } = useTransactions();

  // UI State only
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Derived data
  const groupedTransactions = groupByDate(transactions);
  const { totalIncome, totalExpense, balance } = calculateTotals(transactions);

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingMore, hasMore, loadMore],
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Loading Modals */}
      {isLoading && <LoadingModal text={"Memuat data..."} />}
      {!isHydrated && <LoadingModal text={"Memuat sesi..."} />}

      <Header
        setIsExpenseModalOpen={setIsExpenseModalOpen}
        setIsIncomeModalOpen={setIsIncomeModalOpen}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <Stats
          balance={balance}
          totalExpense={totalExpense}
          totalIncome={totalIncome}
        />

        {/* Filter Section */}
        <FilterSection
          transactions={transactions}
          customDate={customDate}
          filterOptions={filterOptions}
          filter={filter}
          setCustomDate={setCustomDate}
          setFilter={setFilter}
        />

        {/* Transaction List with Infinite Scroll */}
        <div className="space-y-6">
          {groupedTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-3 text-gray-500">
                  Belum ada transaksi untuk periode ini
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {groupedTransactions.map(
                ([date, dayTransactions], groupIndex) => {
                  const isLastGroup =
                    groupIndex === groupedTransactions.length - 1;
                  const dayTotalIncome = dayTransactions
                    .filter((t) => t.type === "income")
                    .reduce((sum, t) => sum + t.amount, 0);
                  const dayTotalExpense = dayTransactions
                    .filter((t) => t.type === "expense")
                    .reduce((sum, t) => sum + t.amount, 0);

                  return (
                    <div key={date} ref={isLastGroup ? lastItemRef : undefined}>
                      <TransactionWrapper
                        date={date}
                        dayTotalExpense={dayTotalExpense}
                        dayTotalIncome={dayTotalIncome}
                        dayTransactions={dayTransactions}
                        deleteTransaction={deleteTransaction}
                        setEditingTransaction={setEditingTransaction}
                        setIsExpenseModalOpen={setIsExpenseModalOpen}
                        setIsIncomeModalOpen={setIsIncomeModalOpen}
                      />
                    </div>
                  );
                },
              )}

              {/* Loading more indicator */}
              {isFetchingMore && (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                  <span className="ml-2 text-sm text-gray-500">
                    Memuat lebih banyak...
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <TransactionFormModal
        isOpen={isIncomeModalOpen}
        onClose={() => {
          setIsIncomeModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={(data) => {
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, data);
          } else {
            addTransaction("income", data);
          }
          setEditingTransaction(null);
        }}
        type="income"
        editingTransaction={editingTransaction}
      />

      <TransactionFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={(data) => {
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, data);
          } else {
            addTransaction("expense", data);
          }
          setEditingTransaction(null);
        }}
        type="expense"
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
