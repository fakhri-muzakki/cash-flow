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
import type { FilterType } from "../type";

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
}

const FilterSection = ({
  filter,
  setFilter,
  setCustomDate,
  customDate,
  filterOptions,
}: FilterSectionProps) => {
  return (
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
  );
};

export default FilterSection;
