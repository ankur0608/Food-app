import { useEffect, useState } from "react";
import styles from "./OrderSummary.module.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "../Store/theme"; 

const OrderSummary = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { theme } = useTheme(); 

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orderDetails"));
    setOrderDetails(data);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${orderDetails.date}`, 14, 30);
    doc.text(`Order ID: ${orderDetails.razorpay_order_id}`, 14, 37);
    doc.text(`Payment ID: ${orderDetails.razorpay_payment_id}`, 14, 44);

    autoTable(doc, {
      startY: 55,
      head: [["Field", "Value"]],
      body: [
        ["Customer Name", orderDetails.buyer.name],
        ["Email", orderDetails.buyer.email],
        ["Mobile", orderDetails.buyer.mobile],
        ["Address", orderDetails.buyer.address],
        [
          "Amount",
          `${orderDetails.currency} $${orderDetails.amount.toFixed(2)}`,
        ],
      ],
    });

    doc.save("Invoice.pdf");
  };

  if (!orderDetails) {
    return (
      <div
        className={`${styles.orderSummaryContainer} ${
          theme === "dark" ? "dark" : ""
        }`}
      >
        Loading order details...
      </div>
    );
  }

  return (
    <div
      className={`${styles.orderSummaryContainer} ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <h2 className={styles.heading}>Order Summary</h2>

      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.label}>Order ID</td>
            <td className={styles.value}>{orderDetails.razorpay_order_id}</td>
          </tr>
          <tr>
            <td className={styles.label}>Payment ID</td>
            <td className={styles.value}>{orderDetails.razorpay_payment_id}</td>
          </tr>
          <tr>
            <td className={styles.label}>Amount Paid</td>
            <td className={`${styles.value} ${styles.total}`}>
              {orderDetails.currency} ${orderDetails.amount.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>Date</td>
            <td className={styles.value}>{orderDetails.date}</td>
          </tr>
          <tr>
            <td className={styles.label}>Customer Name</td>
            <td className={styles.value}>{orderDetails.buyer.name}</td>
          </tr>
          <tr>
            <td className={styles.label}>Email</td>
            <td className={styles.value}>{orderDetails.buyer.email}</td>
          </tr>
          <tr>
            <td className={styles.label}>Mobile</td>
            <td className={styles.value}>{orderDetails.buyer.mobile}</td>
          </tr>
          <tr>
            <td className={styles.label}>Shipping Address</td>
            <td className={styles.value}>{orderDetails.buyer.address}</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.buttonGroup}>
        <button onClick={generatePDF} className={styles.downloadButton}>
          📄 Download Invoice
        </button>
        <Link to="/" className={styles.backButton}>
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
