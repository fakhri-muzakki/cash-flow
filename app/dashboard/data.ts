type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  note: string;
  date: string;
}

const dummyData: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 5000000,
    note: "Gaji Bulanan",
    date: "2026-05-01",
  },
  {
    id: "2",
    type: "expense",
    amount: 150000,
    note: "Makan Siang",
    date: "2026-05-01",
  },
  {
    id: "3",
    type: "expense",
    amount: 200000,
    note: "Bensin",
    date: "2026-05-02",
  },
  {
    id: "4",
    type: "income",
    amount: 500000,
    note: "Freelance",
    date: "2026-05-03",
  },
  {
    id: "5",
    type: "expense",
    amount: 50000,
    note: "Parkir",
    date: "2026-05-03",
  },
  {
    id: "6",
    type: "expense",
    amount: 750000,
    note: "Belanja Bulanan",
    date: "2026-05-04",
  },
  {
    id: "7",
    type: "income",
    amount: 200000,
    note: "Return",
    date: "2026-05-05",
  },
];

export default dummyData;
