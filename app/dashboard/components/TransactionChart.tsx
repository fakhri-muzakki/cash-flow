"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Transaction } from "../type";

interface ChartData {
  date: string;
  dateLabel: string;
  income: number;
  expense: number;
}

interface TransactionChartProps {
  transactions: Transaction[];
}

export function TransactionChart({ transactions }: TransactionChartProps) {
  // Group transactions by day (yyyy-MM-dd)
  const dailyDataMap = transactions.reduce<Map<string, ChartData>>(
    (acc, tx) => {
      const date = new Date(tx.date);
      const dayKey = format(date, "yyyy-MM-dd");
      const dayLabel = format(date, "dd MMM yyyy", { locale: id });

      if (!acc.has(dayKey)) {
        acc.set(dayKey, {
          date: dayKey,
          dateLabel: dayLabel,
          income: 0,
          expense: 0,
        });
      }

      const entry = acc.get(dayKey)!;
      if (tx.type === "income") {
        entry.income += tx.amount;
      } else {
        entry.expense += tx.amount;
      }

      return acc;
    },
    new Map(),
  );

  // Convert Map to array and sort by date ascending
  const chartData = Array.from(dailyDataMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Belum ada data transaksi untuk chart.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateLabel"
            angle={-45}
            textAnchor="end"
            height={70}
            interval={Math.floor(chartData.length / 7)} // tampilkan ~7 label saja
          />
          <YAxis />
          <Tooltip
            formatter={(value) => {
              if (typeof value === "number") {
                return `Rp ${value.toLocaleString("id-ID")}`;
              }
              return value;
            }}
            labelFormatter={(label) => `Tanggal: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Pendapatan"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Pengeluaran"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
