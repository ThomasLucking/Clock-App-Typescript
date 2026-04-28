import { Elysia } from 'elysia'
import { LabelInsertSchema, LabelUpdateSchema } from '../../schemas/labels.schema'
import { paramsSchema } from '../../schemas/project.schema'
import { createLabel, deleteLabel, getLabels, modifyLabel } from './labels.queries'

export const labelRoutes = new Elysia({ prefix: '/labels' })
  .onError(({ error, code, status }) => {
    if (code === 'VALIDATION') return error.message
    if(code === 'NOT_FOUND') return error.message
    return status(500, { error: 'Internal Server Error' })
  })
  .get('', () => getLabels())
  .post('/', async ({ body, status }) => {
    const result = await createLabel(body)
    if (result.length === 0) return status(400, { error: 'Failed to create label' })
    return status(201, result[0])
  }, {
    body: LabelInsertSchema,
  })
  .delete('/:id', async ({ params: { id }, status }) => {
    const result = await deleteLabel(id)
    if (result.length === 0) return status(404, { error: 'Label not found' })
    return status(204, null)
  }, {
    params: paramsSchema
  })
  .patch('/:id', async ({ params: { id }, body, status }) => {
    const result = await modifyLabel(body, id)
    if (result.length === 0) return status(404, { error: 'Label not found' })
    return result[0]
  }, {
    body: LabelUpdateSchema,
    params: paramsSchema
  })