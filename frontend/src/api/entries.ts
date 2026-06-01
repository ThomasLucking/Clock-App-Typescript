export type EntryPayload = {
  project_id: number
  description: string | null
  start_time: string
  end_time: string
}

export type Entry = {
  time_entry_id: number
  project_id: number
  description: string
  start_time: string
  end_time: string
}

export const createEntries = async (payload: EntryPayload) => {
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response;
};

export const getEntry = async (id: string): Promise<Entry> => {
  const response = await fetch(`/api/entries/${id}`);
  return response.json();
};

export const updateEntry = async (id: string, payload: EntryPayload) => {
  const response = await fetch(`/api/entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response;
};
