"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyReservations.module.css";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user email from localStorage
  const userEmail = (() => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;
      const parsed = JSON.parse(user);
      return parsed.email;
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  })();

  useEffect(() => {
    if (!userEmail) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://food-app-d8r3.onrender.com/contact?email=${userEmail}`
        );
        setReservations(res.data.reservations || []);
      } catch (err) {
        console.error("Failed to fetch reservations", err);
        setError("Failed to load reservations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userEmail]);

  if (loading) return <p className={styles.loading}>Loading reservations...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!reservations.length)
    return <p className={styles.noData}>You have no reservations.</p>;

  return (
    <div className={styles.container}>
      <h2>My Reservations</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const statusClass =
                res.status === "pending"
                  ? styles.pending
                  : res.status === "approved"
                  ? styles.approved
                  : styles.rejected;

              return (
                <tr key={res.id}>
                  <td>{new Date(res.date).toLocaleDateString()}</td>
                  <td>{res.time}</td>
                  <td>{res.guests}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
