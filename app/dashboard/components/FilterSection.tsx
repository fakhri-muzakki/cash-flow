import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeOff, FileText, Filter, LineChart } from "lucide-react";
import type { FilterType, Transaction } from "../type";
import { useState } from "react";
import { TransactionChart } from "./TransactionChart";
import { exportToPDF } from "../utils/exportPDF";
import { format } from "date-fns";

interface FiterOptions {
  value: string;
  label: string;
}

interface FilterSectionProps {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  setCustomDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  customDate: Date | undefined;
  filterOptions: FiterOptions[];
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const FilterSection = ({
  filter,
  transactions,
  setFilter,
  setCustomDate,
  customDate,
  totalIncome,
  totalExpense,
  balance,
  filterOptions,
}: FilterSectionProps) => {
  const [showChart, setShowChart] = useState(false);

  const handleExportPDF = () => {
    exportToPDF({
      transactions, // data transaksi yang sudah difilter (tidak perlu filter ulang)
      totalIncome,
      totalExpense,
      balance,
      filter, // filter saat ini untuk judul periode
      customDate, // untuk custom date
      fileName: `laporan-${format(new Date(), "yyyy-MM-dd")}.pdf`,
    });
  };
  return (
    <>
      {showChart && (
        <div className="mb-8 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">
            Grafik Keuangan (Bulanan)
          </h2>
          <TransactionChart transactions={transactions} />
        </div>
      )}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v as FilterType);
            setCustomDate(undefined);
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
          <Button variant="outline" onClick={() => setShowChart(!showChart)}>
            {showChart ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <LineChart className="h-4 w-4" />
            )}
            {showChart ? "Tutup chart" : "Buka Chart"}
          </Button>
          <DatePicker
            value={customDate}
            onChange={(e) => {
              setFilter("custom");
              setCustomDate(e);
            }}
          />
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 " />
            Export PDF
          </Button>
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
    </>
  );
};

export default FilterSection;
