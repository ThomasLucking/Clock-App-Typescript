import { Temporal } from "@js-temporal/polyfill";
import * as v from "valibot";

const datetimeToInstant = v.pipe(
  v.string(),
  v.isoDateTimeSecond("Invalid datetime format"),
  v.transform((s) =>
    Temporal.PlainDateTime.from(s).toZonedDateTime(USER_TIMEZONE).toInstant(),
  ),
);

const isoInstant = v.pipe(
  v.string(),
  v.isoTimestamp("Invalid timestamp format"),
  v.transform((s) => new Date(s)),
);

const USER_TIMEZONE = Temporal.Now.timeZoneId();
export const entriesInsertSchema = v.pipe(
  v.object({
    project_id: v.number(),
    description: v.string(),
    start_time: isoInstant,
    end_time: v.nullable(isoInstant),
  }),
  v.check((data) => {
    if (!data.end_time) return true;
    return data.end_time.getTime() >= data.start_time.getTime();
  }, "End time must be after start time"),
);

export const entriesSchema = v.object({
  project_id: v.number(),
  description: v.string(),
  start_time: v.date(),
  end_time: v.nullable(v.date()),
  time_entry_id: v.number(),
  created_at: v.date(),
  updated_at: v.date(),
});

export const entriesUpdateSchema = v.pipe(
  v.partial(
    v.object({
      project_id: v.number(),
      description: v.string(),
      start_time: isoInstant,
      end_time: isoInstant,
    }),
  ),
  v.check(
    (data) => Object.values(data).some((v) => v !== undefined),
    "At least one field must be provided",
  ),
  v.check((data) => {
    if (!data.start_time || !data.end_time) return true;
    return data.end_time.getTime() >= data.start_time.getTime();
  }, "End time must be after start time"),
);

export const clockInSchema = v.object({
  project_id: v.number(),
  description: v.optional(v.string(), ""),
});

export const entryLabelSchema = v.object({
  label_id: v.number(),
});

export const entryLabelParamsSchema = v.object({
  id: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
  labelId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
});

export const paginationSchema = v.object({
  page: v.optional(
    v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
  ),
  limit: v.optional(
    v.pipe(
      v.string(),
      v.transform(Number),
      v.integer(),
      v.minValue(1),
      v.maxValue(100),
    ),
  ),
});

export type EntryInsert = v.InferOutput<typeof entriesInsertSchema>;
export type EntryUpdate = v.InferOutput<typeof entriesUpdateSchema>;
export type Entry = v.InferOutput<typeof entriesSchema>;
export type EntryLabel = v.InferOutput<typeof entryLabelSchema>;
export type Pagination = v.InferOutput<typeof paginationSchema>;
export type ClockIn = v.InferOutput<typeof clockInSchema>;
