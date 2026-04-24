import * as v from 'valibot'

export const ProjectInsertSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
  description: v.string(),
})

export const ProjectSchema = v.object({
  ...ProjectInsertSchema.entries,
  id: v.number(),
  created_at: v.date(),
  updated_at: v.date(),
})

export const paramsSchema = v.object({ id: v.pipe(v.string(), v.transform(Number)) })


export const ProjectUpdateSchema = v.partial(ProjectInsertSchema)

export type ProjectInsert = v.InferInput<typeof ProjectInsertSchema>
export type ProjectUpdate = v.InferInput<typeof ProjectUpdateSchema>
export type Project = v.InferOutput<typeof ProjectSchema>