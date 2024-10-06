import { Entry } from "../../types/types";

const BASE_URL = "http://localhost:5000/api";

const REQUEST_HEADERS = {
  "Content-Type": "application/json",
};

export const fetchPaymentIntentByInvoice = async (
  invoiceId: number
) => {
  const result = await fetch(
    BASE_URL + "/fetch-payment-intent/" + invoiceId,
    {
      headers: REQUEST_HEADERS,
    }
  );

  return await result.json();
};

export const generatePaymentIntent = async (
  debit: Entry
) => {
  const result = await fetch(
    BASE_URL + "/create-payment-intent",
    {
      method: "POST",
      body: JSON.stringify(debit),
      headers: REQUEST_HEADERS,
    }
  );

  return await result.json();
};
