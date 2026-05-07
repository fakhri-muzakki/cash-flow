"use client";

import { pdf } from "@react-pdf/renderer";
import { TransactionPDF } from "../components/TransactionPDF";
import type { Transaction } from "../type";

interface ExportPDFProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  filter: string;
  customDate?: Date;
  fileName?: string;
}

export async function exportToPDF({
  transactions,
  totalIncome,
  totalExpense,
  balance,
  filter,
  customDate,
  fileName = "laporan-keuangan.pdf",
}: ExportPDFProps) {
  const blob = await pdf(
    <TransactionPDF
      transactions={transactions}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
      filter={filter}
      customDate={customDate}
    />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
