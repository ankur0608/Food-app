// PaymentTable.jsx
import styles from "../Componentes/Pages/PaymentHistory.module.css";

export default function PaymentTable({ data, onView }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((payment, i) => (
            <tr key={i}>
              <td>{payment.date}</td>
              <td>{payment.orderId}</td>
              <td>₹{payment.amount}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    styles[payment.status?.toLowerCase()] || styles.pending
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td>
                <button
                  className={styles.viewBtn}
                  onClick={() => onView(payment)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
