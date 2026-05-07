import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";

interface StatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const Stats = ({ totalIncome, totalExpense, balance }: StatsProps) => {
  return (
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
  );
};

export default Stats;
