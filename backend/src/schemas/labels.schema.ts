import * as v from 'valibot'

export const LabelInsertSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
  color: v.pipe(v.string(), v.maxLength(255))
})

export const LabelSchema = v.object({
  ...LabelInsertSchema.entries,
  label_id: v.number(),
  created_at: v.string(),
  updated_at: v.string(),
})

export const LabelUpdateSchema = v.pipe(
  v.partial(LabelInsertSchema),
  v.check(
    (data) => Object.values(data).some((v) => v !== undefined),
    'At least one field must be provided'
  )
)

export const entryLabelSchema = v.object({
  label_id: v.number(),
})


export type LabelInsert = v.InferOutput<typeof LabelInsertSchema>
export type LabelUpdate = v.InferOutput<typeof LabelUpdateSchema>
export type Label = v.InferOutput<typeof LabelSchema>
