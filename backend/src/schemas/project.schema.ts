import * as v from 'valibot'

export const ProjectInsertSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
  description: v.pipe(v.string(), v.maxLength(1000))
})

export const ProjectSchema = v.object({
  ...ProjectInsertSchema.entries,
  id: v.number(),
  created_at: v.string(),
  updated_at: v.string(),
})

export const paramsSchema = v.object({
  id: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1))

})

export const ProjectUpdateSchema = v.pipe(
  v.partial(ProjectInsertSchema),
  v.check(
    (data) => Object.values(data).some((v) => v !== undefined),
    'At least one field must be provided'
  )
)


export type ProjectInsert = v.InferInput<typeof ProjectInsertSchema>
export type ProjectUpdate = v.InferInput<typeof ProjectUpdateSchema>
export type Project = v.InferOutput<typeof ProjectSchema>
export type ProjectParams = v.InferOutput<typeof paramsSchema>