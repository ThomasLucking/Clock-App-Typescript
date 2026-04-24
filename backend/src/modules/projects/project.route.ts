import { Elysia } from 'elysia'
import { ProjectInsertSchema, ProjectUpdateSchema, paramsSchema } from '../../schemas/project.schema'
import { createProject, deleteProject, getProjects, modifyProject } from './project.queries'

export const projectRoutes = new Elysia({ prefix: '/projects' })
  .get('/', () => getProjects())
  .post('/', ({ body }) => createProject(body), {
    body: ProjectInsertSchema,
  })
  .delete('/:id', ({ params: { id } }) => deleteProject(id), {
    params: paramsSchema
  })
  .patch('/:id', ({ params: { id }, body }) => modifyProject(body, id), {
    body: ProjectUpdateSchema,
    params: paramsSchema
  })