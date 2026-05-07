import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../type";

interface TransactionWrapperProps {
  date: string;
  dayTotalIncome: number;
  dayTotalExpense: number;
  dayTransactions: Transaction[];
  setEditingTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setIsIncomeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExpenseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteTransaction: (id: string) => void;
}

const TransactionWrapper = ({
  date,
  dayTotalIncome,
  dayTotalExpense,
  dayTransactions,
  setEditingTransaction,
  setIsIncomeModalOpen,
  setIsExpenseModalOpen,
  deleteTransaction,
}: TransactionWrapperProps) => {
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
                if (transaction.type === "income") setIsIncomeModalOpen(true);
                else setIsExpenseModalOpen(true);
              }}
              onDelete={() => deleteTransaction(transaction.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionWrapper;
