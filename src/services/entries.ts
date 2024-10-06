const REQUEST_HEADERS = {
  "Content-Type": "application/json",
};

export const fetchEntriesBy = async (property:  string, value: string) => {
  const res = await fetch('http://127.0.0.1:5000/api/entries?' + property + "=" + value, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const createCreditEntry = async (paymentIntentId: string) => {
  const res = await fetch("http://127.0.0.1:5000/api/create-credit-entry", {
    method: "POST",
    body: JSON.stringify({paymentIntentId: paymentIntentId}),
    headers: REQUEST_HEADERS,
  });
  return await res.json();
}
