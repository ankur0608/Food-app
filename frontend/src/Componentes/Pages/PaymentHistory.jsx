import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../supabaseClient";
import { useTheme } from "../Store/theme";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./PaymentHistory.module.css";

const fetchPaymentHistory = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("email", userEmail)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((p) => ({
    id: p.id,
    date: new Date(p.created_at).toLocaleString(),
    orderId: p.order_id,
    paymentId: p.payment_id,
    signature: p.signature,
    amount: p.amount,
    currency: p.currency,
    name: p.name,
    email: p.email,
    mobile: p.mobile,
    address: p.address,
    items: p.items,
    status: p.status || "Success",
  }));
};

export default function PaymentHistory() {
  const { theme } = useTheme();
  const { data, isError, error } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: fetchPaymentHistory,
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const closeModal = () => setSelectedPayment(null);

  const downloadPDF = () => {
    if (!selectedPayment) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payment Receipt", 14, 20);

    autoTable(doc, {
      startY: 30,
      body: [
        ["Order ID", selectedPayment.orderId],
        ["Payment ID", selectedPayment.paymentId],
        ["Signature", selectedPayment.signature],
        ["Name", selectedPayment.name],
        ["Email", selectedPayment.email],
        ["Mobile", selectedPayment.mobile],
        ["Address", selectedPayment.address],
        ["Amount", `$${selectedPayment.amount} ${selectedPayment.currency}`],
        ["Status", selectedPayment.status],
        ["Date", selectedPayment.date],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: "#333" },
        1: { textColor: "#555" },
      },
    });

    doc.save(`Payment_${selectedPayment.orderId}.pdf`);
  };

  if (isError) return <p className={styles.error}>Error: {error.message}</p>;
  if (!data || data.length === 0)
    return <p className={styles.empty}>No payment history found.</p>;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.title}>Payment History</h2>
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
                    onClick={() => setSelectedPayment(payment)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div
            className={`${styles.modal} ${styles[theme]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className={styles.paymentheader}>Payment Details</h1>
            <p>
              <strong>Order ID:</strong> {selectedPayment.orderId}
            </p>
            <p>
              <strong>Payment ID:</strong> {selectedPayment.paymentId}
            </p>
            <p>
              <strong>Signature:</strong> {selectedPayment.signature}
            </p>
            <p>
              <strong>Name:</strong> {selectedPayment.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedPayment.email}
            </p>
            <p>
              <strong>Mobile:</strong> {selectedPayment.mobile}
            </p>
            <p>
              <strong>Address:</strong> {selectedPayment.address}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedPayment.amount}{" "}
              {selectedPayment.currency}
            </p>
            <p>
              <strong>Status:</strong> {selectedPayment.status}
            </p>
            <p>
              <strong>Date:</strong> {selectedPayment.date}
            </p>

            <div>
              <button onClick={downloadPDF} className={styles.downloadBtn}>
                Download PDF
              </button>
              <button onClick={closeModal} className={styles.closeBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
