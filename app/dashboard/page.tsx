// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { id } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dummyData from "./data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/date-picker";

// Types
type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  note: string;
  date: string;
}

type FilterType = "today" | "thisWeek" | "thisMonth" | "thisYear" | "custom";

// Zod Schema untuk form transaksi
const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, "Nominal harus diisi")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Nominal harus berupa angka positif",
    }),
  note: z
    .string()
    .min(1, "Catatan harus diisi")
    .max(100, "Catatan maksimal 100 karakter"),
  date: z.string().min(1, "Tanggal harus diisi"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

// Transaction Form Modal Component
function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  editingTransaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; note: string; date: string }) => void;
  type: TransactionType;
  editingTransaction?: Transaction | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      note: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    if (editingTransaction) {
      reset({
        amount: editingTransaction.amount.toString(),
        note: editingTransaction.note,
        date: editingTransaction.date,
      });
    } else {
      reset({
        amount: "",
        note: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [editingTransaction, reset, isOpen]);

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      amount: parseFloat(data.amount),
      note: data.note,
      date: data.date,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit" : "Tambah"}{" "}
            {type === "income" ? "Pendapatan" : "Pengeluaran"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              {...register("amount")}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan</Label>
            <Input
              id="note"
              placeholder="Misal: Gaji, Makan Siang, dll"
              {...register("note")}
              className={errors.note ? "border-red-500" : ""}
            />
            {errors.note && (
              <p className="text-sm text-red-500">{errors.note.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingTransaction
                  ? "Simpan Perubahan"
                  : type === "income"
                    ? "Tambah Pendapatan"
                    : "Tambah Pengeluaran"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Transaction Item Component
function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="flex items-center gap-3">
        <div
          className={`rounded-full p-2 ${
            transaction.type === "income"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          }`}
        >
          {transaction.type === "income" ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {transaction.note}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(transaction.date), "dd MMM yyyy", { locale: id })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`font-semibold ${
            transaction.type === "income" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"} Rp{" "}
          {transaction.amount.toLocaleString("id-ID")}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>("thisMonth");
  const [customDate, setCustomDate] = useState<Date | undefined>();
  // const [customDate, setCustomDate] = useState("");
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      // Dummy data
      const data = dummyData;
      setTransactions(data);
      localStorage.setItem("transactions", JSON.stringify(data));
    }
  }, []);

  // Save to localStorage when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  // Filter transactions
  const getFilteredTransactions = (): Transaction[] => {
    const now = new Date();

    // PRIORITAS: Jika customDate dipilih, gunakan itu terlepas dari filter
    if (customDate) {
      const startDate = new Date(customDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(customDate);
      endDate.setHours(23, 59, 59, 999);

      return transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= startDate && tDate <= endDate;
      });
    }

    // Jika tidak ada customDate, gunakan filter biasa
    let startDate: Date;
    let endDate: Date = now;

    switch (filter) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "thisWeek":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "thisMonth":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "thisYear":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        return transactions;
    }

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });
  };

  // Group by date
  const groupByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.forEach((t) => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
    );
  };

  // Calculate totals
  const calculateTotals = (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  };

  // CRUD Operations
  const addTransaction = (
    type: TransactionType,
    data: { amount: number; note: string; date: string },
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: data.amount,
      note: data.note,
      date: data.date,
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (
    id: string,
    data: { amount: number; note: string; date: string },
  ) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? { ...t, amount: data.amount, note: data.note, date: data.date }
          : t,
      ),
    );
  };

  const deleteTransaction = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const filteredTransactions = getFilteredTransactions();
  const groupedTransactions = groupByDate(filteredTransactions);
  const { totalIncome, totalExpense, balance } =
    calculateTotals(filteredTransactions);

  const filterOptions = [
    { value: "today", label: "Hari Ini" },
    { value: "thisWeek", label: "Minggu Ini" },
    { value: "thisMonth", label: "Bulan Ini" },
    { value: "thisYear", label: "Tahun Ini" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Kelola pemasukan dan pengeluaranmu
              </p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Transaksi
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setIsIncomeModalOpen(true)}
                    className="cursor-pointer gap-2"
                  >
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Tambah Pendapatan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="cursor-pointer gap-2"
                  >
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                    <span>Tambah Pengeluaran</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    Rp {totalIncome.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-rose-600">
                    Rp {totalExpense.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/30">
                  <TrendingDown className="h-6 w-6 text-rose-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Saldo</p>
                  <p className="text-2xl font-bold">
                    Rp {balance.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-3 backdrop-blur">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}

        {/* ======================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Select
            value={filter}
            onValueChange={(v) => {
              setFilter(v as FilterType);
              setCustomDate(undefined); // Reset custom date saat filter berubah
            }}
          >
            <SelectTrigger className="w-45">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <DatePicker value={customDate} onChange={setCustomDate} />
            {customDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCustomDate(undefined)}
                className="text-gray-500"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Transaction List */}
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
            groupedTransactions.map(([date, dayTransactions]) => {
              const dayTotalIncome = dayTransactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0);
              const dayTotalExpense = dayTransactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <Card key={date}>
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between border-b p-4 pt-0 dark:border-gray-800">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {format(new Date(date), "EEEE, dd MMMM yyyy", {
                            locale: id,
                          })}
                        </h3>
                        <div className="flex gap-4 text-xs">
                          <span className="text-emerald-600">
                            Rp {dayTotalIncome.toLocaleString("id-ID")}
                          </span>
                          <span className="text-rose-600">
                            - Rp {dayTotalExpense.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {dayTransactions.length} transaksi
                      </div>
                    </div>
                    <div className="divide-y dark:divide-gray-800">
                      {dayTransactions.map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          onEdit={() => {
                            setEditingTransaction(transaction);
                            if (transaction.type === "income")
                              setIsIncomeModalOpen(true);
                            else setIsExpenseModalOpen(true);
                          }}
                          onDelete={() => deleteTransaction(transaction.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
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
