import * as v from 'valibot'

export const entriesInsertSchema = v.pipe(
  v.object({
    project_id: v.number(),
    description: v.string(),
    start_time: v.pipe(v.string(), v.isoTimestamp(), v.transform(s => new Date(s))),
    end_time: v.pipe(v.string(), v.isoTimestamp(), v.transform(s => new Date(s))),
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
  created_at: v.date(),
  updated_at: v.date(),
})

export const entriesUpdateSchema = v.pipe(
  v.partial(v.object({
    project_id: v.number(),
    description: v.string(),
    start_time: v.pipe(v.string(), v.isoTimestamp(), v.transform(s => new Date(s))),
    end_time: v.pipe(v.string(), v.isoTimestamp(), v.transform(s => new Date(s))),
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


export const entryLabelSchema = v.object({
  label_id: v.number(),
})

export const entryLabelParamsSchema = v.object({
  id: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
  labelId: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))
})


export const paginationSchema = v.object({
    page: v.optional(v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))),
    limit: v.optional(v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))),
})

export type EntryInsert = v.InferOutput<typeof entriesInsertSchema>
export type EntryUpdate = v.InferOutput<typeof entriesUpdateSchema>
export type Entry = v.InferOutput<typeof entriesSchema>
export type entryLabel = v.InferOutput<typeof entriesSchema>
export type Pagination = v.InferOutput<typeof paginationSchema>