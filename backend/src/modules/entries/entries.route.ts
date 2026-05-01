import { Elysia } from "elysia";
import {
  clockInSchema,
  entriesInsertSchema,
  entriesUpdateSchema,
  entryLabelParamsSchema,
  entryLabelSchema,
  paginationSchema,
} from "../../schemas/entries.schema";
import { paramsSchema } from "../../schemas/project.schema";
import {
  addLabelToEntry,
  clockIn,
  clockOut,
  createEntry,
  deleteEntry,
  getActiveSession,
  getEntries,
  getEntriesCount,
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
  .post(
    "/clockin",
    async ({ body, status }) => {
      try {
        const result = await clockIn(body);
        return status(201, result[0]);
      } catch (e: unknown) {
        if (
          e instanceof Error &&
          "code" in e &&
          (e as { code: string }).code === "23505"
        )
          return status(400, { error: "Already clocked in" });
        throw e;
      }
    },
    { body: clockInSchema },
  )
  .patch("/clockout", async ({ status }) => {
    const result = await clockOut();
    if (result.length === 0)
      return status(400, { error: "No active session to clock out" });
    return result[0];
  })
  // to modify an active entry, import just need to pass the actives session id instead of a normal id in the modifyEntry endpoint.
  .get("/active", async ({ status }) => {
    const result = await getActiveSession();
    if (result.length === 0) return status(404, { error: "No active session" });
    return result[0];
  })

  .get(
    "",
    async ({ query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const offset = (page - 1) * limit; // basically tells DB "skip" 10 rows if you are on page 2 etc..

      const [data, countResult] = await Promise.all([
        getEntries(limit, offset),
        getEntriesCount(),
      ]);

      const total = Number(countResult[0].count);
      const totalPages = Math.ceil(total / limit);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    },
    {
      query: paginationSchema,
      detail: {
        description:
          "Returns time entries ordered by created_at descending (most recent first). Paginate with `page` (default 1) and `limit` (default 10) query params.",
      },
    },
  )
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
    async ({ params: { id } }) => {
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
