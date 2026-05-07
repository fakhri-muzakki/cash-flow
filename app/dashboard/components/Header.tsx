import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";

interface HeaderProps {
  setIsIncomeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExpenseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = ({
  setIsIncomeModalOpen,
  setIsExpenseModalOpen,
}: HeaderProps) => {
  return (
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
  );
};

export default Header;
