import { Elysia, t } from 'elysia'
import { ProjectInsertSchema, ProjectUpdateSchema, paramsSchema } from '../../schemas/projectSchema'
import { getProjects, createProject, deleteProject, modifyProject } from './project.queries'

export const projectRoutes = new Elysia({ prefix: '/projects' })
  .get('/projects', () => getProjects())
  .post('/projects', ({ body }) => createProject(body), {
    body: ProjectInsertSchema,
  })
  .delete('/projects/:id', ({ params: { id } }) => deleteProject(id), {
    params: paramsSchema
  })
  .patch('/projects/:id', ({ params: { id }, body }) => modifyProject(body, id), {
    body: ProjectUpdateSchema,
    params: paramsSchema
  })