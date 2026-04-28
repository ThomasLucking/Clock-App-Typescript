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


export const addLabelToEntry = (entryId: number, labelId: number) =>
  sql`insert into Time_entry_labels (time_entry_id, label_id) values (${entryId}, ${labelId}) returning *`

export const removeLabelFromEntry = (entryId: number, labelId: number) =>
  sql`delete from Time_entry_labels where time_entry_id = ${entryId} and label_id = ${labelId} returning *`

export const getEntryLabels = (entryId: number) =>
  sql`select l.* from Labels l
      join Time_entry_labels tel on tel.label_id = l.label_id
      where tel.time_entry_id = ${entryId}`