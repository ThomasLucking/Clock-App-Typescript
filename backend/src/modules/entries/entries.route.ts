import { Elysia } from "elysia";
import {
  entriesInsertSchema,
  entriesUpdateSchema,
  entryLabelParamsSchema,
  entryLabelSchema,
} from "../../schemas/entries.schema";
import { paramsSchema } from "../../schemas/project.schema";
import {
  addLabelToEntry,
  createEntry,
  deleteEntry,
  getEntries,
  getEntryById,
  getEntryLabels,
  modifyEntry,
  removeLabelFromEntry,
} from "./entries.queries";

export const entriesRoutes = new Elysia({ prefix: "/entries" })
  .onError(({ error, code, status }) => {
    if (code === "VALIDATION") return status(422, { error: error.message });
    if (code === "NOT_FOUND") return status(404, { error: error.message });
    return status(500, { error: "Internal Server Error" });
  })
  .get("", () => getEntries())
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      const result = await getEntryById(id);
      if (result.length === 0) return status(404, { error: "Entry not found" });
      return result[0];
    },
    {
      params: paramsSchema,
    },
  )
  .post(
    "",
    async ({ body, status }) => {
      const result = await createEntry(body);
      if (result.length === 0)
        return status(400, { error: "Failed to create entry" });
      return status(201, result[0]);
    },
    {
      body: entriesInsertSchema,
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, status }) => {
      const result = await deleteEntry(id);
      if (result.length === 0) return status(404, { error: "Entry not found" });
      return status(204, null);
    },
    {
      params: paramsSchema,
    },
  )
  .patch(
    "/:id",
    async ({ params: { id }, body, status }) => {
      const result = await modifyEntry(body, id);
      if (result.length === 0) return status(404, { error: "Entry not found" });
      return result[0];
    },
    {
      body: entriesUpdateSchema,
      params: paramsSchema,
    },
  )
  .get(
    "/:id/labels",
    async ({ params: { id }, status }) => {
      const result = await getEntryLabels(id);
      return result;
    },
    {
      params: paramsSchema,
    },
  )
  .post(
    "/:id/labels",
    async ({ params: { id }, body, status }) => {
      const result = await addLabelToEntry(id, body.label_id);
      if (result.length === 0)
        return status(400, { error: "Failed to add label" });
      return status(201, result[0]);
    },
    {
      params: paramsSchema,
      body: entryLabelSchema,
    },
  )
  .delete(
    "/:id/labels/:labelId",
    async ({ params: { id, labelId }, status }) => {
      const result = await removeLabelFromEntry(id, labelId);
      if (result.length === 0)
        return status(404, { error: "Label not found on entry" });
      return status(204, null);
    },
    {
      params: entryLabelParamsSchema,
    },
  );
