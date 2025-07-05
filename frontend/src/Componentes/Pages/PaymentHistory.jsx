import { useEffect, useState } from "react";
import styles from "./PaymentHistory.module.css";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payment history from backend (replace URL as needed)
    async function fetchPayments() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://food-app-d8r3.onrender.com/payment-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPayments(data || []);
      } catch (err) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i}>
                <td>{p.date}</td>
                <td>{p.orderId}</td>
                <td>${parseFloat(p.amount).toFixed(2)}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}