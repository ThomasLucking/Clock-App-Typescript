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
