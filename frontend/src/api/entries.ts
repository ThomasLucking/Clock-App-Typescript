import { treaty } from '@elysiajs/eden'
import type { App } from 'backend';

// End-to-end typed client. `App` is inferred from the backend's Elysia instance,
// so `api.entries.get()`, `api.entries({ id }).get()`, etc. are fully typed.
// Note: this calls the backend directly (not via the Vite `/api` proxy), so the
// backend needs CORS enabled for browser use.
export const api = treaty<App>('localhost:3000')


export type EntryPayload = {
  project_id: number
  description: string
  start_time: string
  end_time: string
}

export type Entry = {
  time_entry_id: number
  project_id: number
  description: string
  start_time: string
  end_time: string | null
}


export const createEntries = async (payload: EntryPayload) => {
  const { response } = await api.entries.post({
    ...payload,
    start_time: new Date(payload.start_time),
    end_time: new Date(payload.end_time),
  })
  return response;
};

export const getEntry = async (id: string): Promise<Entry> => {
  const response = await fetch(`/api/entries/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch entry: ${response.statusText}`);
  }
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
