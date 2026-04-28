import { Elysia } from "elysia";
import { labelRoutes } from "./modules/labels/labels.route";
import { projectRoutes } from "./modules/projects/project.route";

const app = new Elysia()
  .use(projectRoutes)
  .use(labelRoutes)
  .listen(3000)


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


app.handle(new Request('http://localhost:3000/projects')).then(r => r.text().then(console.log))
app.handle(new Request('http://localhost:3000/labels')).then(r => console.log(r.status)) // 404
