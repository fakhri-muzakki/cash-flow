import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import type { FilterType, Transaction } from "../type";
import { useState } from "react";
import { TransactionChart } from "./TransactionChart";

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
}

const FilterSection = ({
  filter,
  transactions,
  setFilter,
  setCustomDate,
  customDate,
  filterOptions,
}: FilterSectionProps) => {
  const [showChart, setShowChart] = useState(false);

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
            {showChart ? "Sembunyikan Chart" : "Tampilkan Chart"}
          </Button>
          <DatePicker
            value={customDate}
            onChange={(e) => {
              setFilter("custom");
              setCustomDate(e);
            }}
          />
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
