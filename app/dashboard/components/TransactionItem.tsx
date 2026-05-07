import { Button } from "@/components/ui/button";
import type { Transaction } from "../type";
import { Edit2, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}) => {
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
};

export default TransactionItem;
