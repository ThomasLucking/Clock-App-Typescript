import { Elysia } from 'elysia'
import { ProjectInsertSchema, ProjectUpdateSchema, paramsSchema } from '../../schemas/project.schema'
import { createProject, deleteProject, getProjects, modifyProject } from './project.queries'

export const projectRoutes = new Elysia({ prefix: '/projects' })
  .onError(({ error, code, status }) => {
    if (code === 'VALIDATION') return error.detail(error.message)
    return status(500, { error: 'Internal server error' })
  })
  .get('/', () => getProjects())
  .post('/', async ({ body, status }) => {
    const result = await createProject(body)
    if (result.length === 0) return status(400, { error: 'Failed to create project' })
    return status(201, result[0])
  }, {
    body: ProjectInsertSchema,
  })

  .delete('/:id', async ({ params: { id }, status }) => {
    const result = await deleteProject(id)
    if (result.length === 0) return status(404, { error: 'Project not found' })
    return status(204, null)
  }, {
    params: paramsSchema
  })

  .patch('/:id', async ({ params: { id }, body, status }) => {
    const result = await modifyProject(body, id)
    if (result.length === 0) return status(404, { error: 'Project not found' })
    return result[0]
  }, {
    body: ProjectUpdateSchema,
    params: paramsSchema
  })