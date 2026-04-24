import { Elysia } from "elysia";
import { projectRoutes } from "./modules/projects/project.route";

const app = new Elysia()
  .use(projectRoutes)
  .listen(3000)


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
