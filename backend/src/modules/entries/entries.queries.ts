import sql from "../../db/client";
import type { ClockIn, EntryInsert, EntryUpdate } from "../../schemas/entries.schema";

export const getEntries = (limit: number, offset: number) =>
  sql`select * from Time_entries order by created_at desc, time_entry_id desc limit ${limit} offset ${offset}`;

export const getEntriesCount = () => sql`select count(*) from Time_entries`;

export const createEntry = (data: EntryInsert) =>
  sql`insert into Time_entries (project_id, start_time, end_time, description) 
      values (${data.project_id}, ${data.start_time}, ${data.end_time}, ${data.description}) 
      returning *`;

export const deleteEntry = (id: number) =>
  sql`delete from Time_entries where time_entry_id = ${id} returning *`;

export const getEntryById = (id: number) =>
  sql`select * from Time_entries where time_entry_id = ${id}`;

export const modifyEntry = (data: EntryUpdate, id: number) =>
  sql`update Time_entries set
      project_id = COALESCE(${data.project_id ?? null}, project_id),
      description = COALESCE(${data.description ?? null}, description),
      start_time = COALESCE(${data.start_time ?? null}, start_time),
      end_time = COALESCE(${data.end_time ?? null}, end_time),
      updated_at = current_timestamp
      where time_entry_id = ${id}
      returning *`;

export const addLabelToEntry = (entryId: number, labelId: number) =>
  sql`insert into Time_entry_labels (time_entry_id, label_id) values (${entryId}, ${labelId}) returning *`;

export const removeLabelFromEntry = (entryId: number, labelId: number) =>
  sql`delete from Time_entry_labels where time_entry_id = ${entryId} and label_id = ${labelId} returning *`;

export const getEntryLabels = (entryId: number) =>
  sql`select l.* from Labels l
      join Time_entry_labels tel on tel.label_id = l.label_id
      where tel.time_entry_id = ${entryId}`;

export const clockIn = (data: ClockIn) =>
  sql`insert into Time_entries (project_id, description, start_time)
      values (${data.project_id}, ${data.description}, now())
      returning *`;

export const clockOut = () =>
  sql`update Time_entries set end_time = now(), updated_at = current_timestamp
      where end_time is null returning *`;

export const getActiveSession = () =>
  sql`select * from Time_entries where end_time is null`;

