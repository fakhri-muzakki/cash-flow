import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Transaction } from "../type";

// Gunakan font standar (tanpa external)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000", // hitam
  },
  period: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  table: {
    display: "flex",
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    padding: 8,
    fontWeight: "bold",
  },
  tableHeaderText: {
    color: "#ffffff", // putih
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  colDate: { width: "20%", paddingHorizontal: 4, color: "#000000" },
  colNote: { width: "40%", paddingHorizontal: 4, color: "#000000" },
  colType: { width: "15%", paddingHorizontal: 4, color: "#000000" },
  colAmount: {
    width: "25%",
    paddingHorizontal: 4,
    textAlign: "right",
    color: "#000000",
  },
  summary: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#000000",
  },
});

interface TransactionPDFProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  filter: string;
  customDate?: Date;
}

export function TransactionPDF({
  transactions,
  totalIncome,
  totalExpense,
  balance,
  filter,
  customDate,
}: TransactionPDFProps) {
  // Debug: cek data
  console.log("PDF transactions count:", transactions.length);
  console.log("PDF transactions sample:", transactions.slice(0, 2));

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const getPeriodText = () => {
    if (filter === "all") return "Semua Transaksi";
    if (filter === "today")
      return format(new Date(), "dd MMMM yyyy", { locale: id });
    if (filter === "thisWeek")
      return `Minggu Ini (${format(new Date(), "dd MMM yyyy", { locale: id })})`;
    if (filter === "thisMonth")
      return format(new Date(), "MMMM yyyy", { locale: id });
    if (filter === "thisYear") return `Tahun ${format(new Date(), "yyyy")}`;
    if (filter === "custom" && customDate) {
      return format(customDate, "dd MMMM yyyy", { locale: id });
    }
    return "Laporan Keuangan";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Laporan Keuangan</Text>
        <Text style={styles.period}>Periode: {getPeriodText()}</Text>

        <View style={styles.table}>
          {/* Header Table */}
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.colDate, ...styles.tableHeaderText }}>
              Tanggal
            </Text>
            <Text style={{ ...styles.colNote, ...styles.tableHeaderText }}>
              Catatan
            </Text>
            <Text style={{ ...styles.colType, ...styles.tableHeaderText }}>
              Tipe
            </Text>
            <Text style={{ ...styles.colAmount, ...styles.tableHeaderText }}>
              Jumlah (Rp)
            </Text>
          </View>

          {/* Data Rows */}
          {sortedTransactions.map((tx) => (
            <View style={styles.tableRow} key={tx.id}>
              <Text style={styles.colDate}>
                {format(new Date(tx.date), "dd MMM yyyy", { locale: id })}
              </Text>
              <Text style={styles.colNote}>{tx.note}</Text>
              <Text style={styles.colType}>
                {tx.type === "income" ? "Pemasukan" : "Pengeluaran"}
              </Text>
              <Text style={styles.colAmount}>
                {tx.type === "income" ? "+ " : "- "}
                {tx.amount.toLocaleString("id-ID")}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryItem}>
            Total Pendapatan: Rp {totalIncome.toLocaleString("id-ID")}
          </Text>
          <Text style={styles.summaryItem}>
            Total Pengeluaran: Rp {totalExpense.toLocaleString("id-ID")}
          </Text>
          <Text style={styles.summaryItem}>
            Saldo: Rp {balance.toLocaleString("id-ID")}
          </Text>
        </View>

        <Text style={styles.footer}>
          Digenerate pada{" "}
          {format(new Date(), "dd MMMM yyyy, HH:mm:ss", { locale: id })}
        </Text>
      </Page>
    </Document>
  );
}
