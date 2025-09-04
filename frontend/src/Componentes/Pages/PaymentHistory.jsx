// PaymentHistory.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../Store/theme";
import { fetchPaymentHistory } from "../fetchPaymentHistory";
import PaymentTable from "../PaymentTable";
import PaymentModal from "../PaymentModal";
import styles from "./PaymentHistory.module.css";

export default function PaymentHistory() {
  const { theme } = useTheme();
  const { data, isError, error } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: fetchPaymentHistory,
  });

  const [selectedPayment, setSelectedPayment] = useState(null);

  if (isError) return <p className={styles.error}>Error: {error.message}</p>;
  if (!data || data.length === 0)
    return <p className={styles.empty}>No payment history found.</p>;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.title}>Payment History</h2>
      <PaymentTable data={data} onView={setSelectedPayment} />
      <PaymentModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}
