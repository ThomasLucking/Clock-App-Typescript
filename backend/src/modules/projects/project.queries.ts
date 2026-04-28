import sql from '../../db/client'
import type { ProjectInsert, ProjectUpdate } from '../../schemas/project.schema'

export const getProjects = () =>
  sql`select * from projects;`

export const createProject = (data: ProjectInsert) =>
  sql`insert into projects (name, description) values (${data.name}, ${data.description}) returning *`

export const deleteProject = (id: number) =>
  sql`delete from projects where project_id = ${id} returning *`

export const modifyProject = (data: ProjectUpdate, id: number) =>
  sql`update projects set
      name = COALESCE(${data.name ?? null}, name),
      description = COALESCE(${data.description ?? null}, description)
      where project_id = ${id}
      returning *`