import sql from '../../db/client'
import type { LabelInsert, LabelUpdate } from '../../schemas/labels.schema'

export const getLabels = () =>
  sql`select * from Labels;`

export const createLabel = (data: LabelInsert) =>
  sql`insert into Labels (name, color) values (${data.name}, ${data.color}) returning *`

export const deleteLabel = (id: number) =>
  sql`delete from Labels where label_id = ${id} returning *`

export const modifyLabel = (data: LabelUpdate, id: number) =>
  sql`update Labels set
      name = COALESCE(${data.name ?? null}, name),
      color = COALESCE(${data.color ?? null}, color)
      where label_id = ${id}
      returning *`