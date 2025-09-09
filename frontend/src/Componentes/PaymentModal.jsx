// PaymentModal.jsx
import styles from "../Componentes/Pages/PaymentHistory.module.css";

export default function PaymentModal({ payment, onClose }) {
  if (!payment) return null;

  const downloadPDF = async () => {
    // ⏳ Dynamically import only when needed
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payment Receipt", 14, 20);

    autoTable(doc, {
      startY: 30,
      body: [
        ["Order ID", payment.orderId],
        ["Payment ID", payment.paymentId],
        ["Signature", payment.signature],
        ["Name", payment.name],
        ["Email", payment.email],
        ["Mobile", payment.mobile],
        ["Address", payment.address],
        ["Amount", `$${payment.amount} ${payment.currency}`],
        ["Status", payment.status],
        ["Date", payment.date],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: "#333" },
        1: { textColor: "#555" },
      },
    });

    doc.save(`Payment_${payment.orderId}.pdf`);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.paymentheader}>Payment Details</h1>
        <p>
          <strong>Order ID:</strong> {payment.orderId}
        </p>
        <p>
          <strong>Payment ID:</strong> {payment.paymentId}
        </p>
        <p>
          <strong>Signature:</strong> {payment.signature}
        </p>
        <p>
          <strong>Name:</strong> {payment.name}
        </p>
        <p>
          <strong>Email:</strong> {payment.email}
        </p>
        <p>
          <strong>Mobile:</strong> {payment.mobile}
        </p>
        <p>
          <strong>Address:</strong> {payment.address}
        </p>
        <p>
          <strong>Amount:</strong> ${payment.amount} {payment.currency}
        </p>
        <p>
          <strong>Status:</strong> {payment.status}
        </p>
        <p>
          <strong>Date:</strong> {payment.date}
        </p>

        <div>
          <button onClick={downloadPDF} className={styles.downloadBtn}>
            Download PDF
          </button>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
