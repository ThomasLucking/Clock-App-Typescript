import * as v from 'valibot'

export const entriesInsertSchema = v.pipe(
  v.object({
    project_id: v.number(),
    description: v.string(),
    start_time: v.pipe(v.string(), v.transform(s => new Date(s))),
    end_time: v.pipe(v.string(), v.transform(s => new Date(s))),
  }),
  v.check(
    (data) => data.end_time >= data.start_time,
    'End time must be after start time'
  )
)

export const entriesSchema = v.object({
  project_id: v.number(),
  description: v.string(),
  start_time: v.date(),
  end_time: v.date(),
  time_entry_id: v.number(),
  created_at: v.string(),
  updated_at: v.string(),
})

export const entriesUpdateSchema = v.pipe(
  v.partial(v.object({
    project_id: v.number(),
    description: v.string(),
    start_time: v.pipe(v.string(), v.transform(s => new Date(s))),
    end_time: v.pipe(v.string(), v.transform(s => new Date(s))),
  })),
  v.check(
    (data) => Object.values(data).some((v) => v !== undefined),
    'At least one field must be provided'
  ),
  v.check(
    (data) => data.start_time === undefined || data.end_time === undefined || data.end_time >= data.start_time,
    'End time must be after start time'
  )
)

export type EntryInsert = v.InferOutput<typeof entriesInsertSchema>
export type EntryUpdate = v.InferOutput<typeof entriesUpdateSchema>
export type Entry = v.InferOutput<typeof entriesSchema>