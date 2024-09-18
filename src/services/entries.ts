const BASE_URL = "http://localhost:5000/api/entries";

const REQUEST_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

export const fetchEntriesBy = async (property:  string, value: string) => {
  const res = await fetch(BASE_URL + '?' + property + "=" + value, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const fetchEntry = async (entryId: string) => {
  const res = await fetch(BASE_URL + "/" + entryId, {
    headers: REQUEST_HEADERS,
  });
  return await res.json();
};

export const updateEntry = async (entryId: string, entryData: object) => {
  await fetch(BASE_URL + "/" + entryId, {
    method: "PATCH",
    headers: REQUEST_HEADERS,
    body: JSON.stringify(entryData),
  });
};

export const createEntry = async (entryData: object) => {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify(entryData)
    })
    return await res.json()
}
