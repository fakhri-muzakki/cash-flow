import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import type { Transaction } from "./type";

export type FilterType =
  | "all"
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "thisYear"
  | "custom";

export function filterTransactions(
  transactions: Transaction[],
  filter: FilterType,
  customDate?: Date,
): Transaction[] {
  if (filter === "all") return transactions;

  const now = new Date();

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
}

export function groupByDate(
  transactions: Transaction[],
): [string, Transaction[]][] {
  const groups: { [key: string]: Transaction[] } = {};
  transactions.forEach((t) => {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  });
  return Object.entries(groups).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
  );
}

export function calculateTotals(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}
