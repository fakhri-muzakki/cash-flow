import { useForm } from "react-hook-form";
import type { Transaction, TransactionType } from "../type";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as z from "zod";

const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, "Nominal harus diisi")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Nominal harus berupa angka positif",
    }),
  note: z
    .string()
    .min(1, "Catatan harus diisi")
    .max(100, "Catatan maksimal 100 karakter"),
  date: z.string().min(1, "Tanggal harus diisi"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const TransactionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  editingTransaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; note: string; date: string }) => void;
  type: TransactionType;
  editingTransaction?: Transaction | null;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      note: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    if (editingTransaction) {
      reset({
        amount: editingTransaction.amount.toString(),
        note: editingTransaction.note,
        date: editingTransaction.date,
      });
    } else {
      reset({
        amount: "",
        note: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [editingTransaction, reset, isOpen]);

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      amount: parseFloat(data.amount),
      note: data.note,
      date: data.date,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit" : "Tambah"}{" "}
            {type === "income" ? "Pendapatan" : "Pengeluaran"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              {...register("amount")}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan</Label>
            <Input
              id="note"
              placeholder="Misal: Gaji, Makan Siang, dll"
              {...register("note")}
              className={errors.note ? "border-red-500" : ""}
            />
            {errors.note && (
              <p className="text-sm text-red-500">{errors.note.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingTransaction
                  ? "Simpan Perubahan"
                  : type === "income"
                    ? "Tambah Pendapatan"
                    : "Tambah Pengeluaran"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormModal;
