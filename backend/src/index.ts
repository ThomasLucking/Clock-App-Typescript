import { Elysia } from "elysia";
import { entriesRoutes } from "./modules/entries/entries.route";
import { labelRoutes } from "./modules/labels/labels.route";
import { projectRoutes } from "./modules/projects/project.route";
const app = new Elysia()
  .use(projectRoutes)
  .use(labelRoutes)
  .use(entriesRoutes)
  .listen(3000)


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


app.handle(new Request('http://localhost:3000/projects')).then(r => r.text().then(console.log))
app.handle(new Request('http://localhost:3000/entries/')).then(r => r.text().then(console.log))
app.handle(new Request('http://localhost:3000/labels/')).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test Project', description: 'A test project' })
})).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/labels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Bug', color: '#ff0000' })
})).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/entries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ project_id: 1, start_time: '2026-01-01T09:00:00Z', end_time: '2026-01-01T10:00:00Z', description: 'Working on feature' })
})).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/entries/1')).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/projects/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Project' })
})).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/labels/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ color: '#00ff00' })
})).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/entries/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ description: 'Updated description' })
})).then(r => r.text().then(console.log))

app.handle(new Request('http://localhost:3000/entries/1', { method: 'DELETE' })).then(r => r.text().then(console.log))
app.handle(new Request('http://localhost:3000/labels/1', { method: 'DELETE' })).then(r => r.text().then(console.log))
app.handle(new Request('http://localhost:3000/projects/1', { method: 'DELETE' })).then(r => r.text().then(console.log))
