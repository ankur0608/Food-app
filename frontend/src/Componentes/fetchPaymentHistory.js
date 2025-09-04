// fetchPaymentHistory.js
import { supabase } from "../../supabaseClient";

export const fetchPaymentHistory = async () => {
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
