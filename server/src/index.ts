import { Elysia, t } from "elysia";
import { Prisma, PrismaClient } from "@prisma/client";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { parseArticle } from "../parse";
import { auth } from "./auth";

const BASE_URL = process.env.BASE_URL || "";
const JWT_SECRET = process.env.JWT_SECRET || "yera-secret-jwt-key-development";
const CORS_ORIGIN = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((s) => s.trim());
const PORT = Number(process.env.PORT) || 8000;

let corsConfig = {
  origin: CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const db = new PrismaClient();

const app = new Elysia({ prefix: BASE_URL })
  .use(cors(corsConfig))
  .use(cookie())
  .use(auth)
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      exp: "7d",
    }),
  )
  .use(swagger())
  // NOTE: using custom CORS below instead of plugin, to reliably reflect any origin
  //.use(cors(corsConfig)) // replaced with manual CORS handling
  .get("/", function () {
    return "Hello";
  })
  // TODO: load all data upfront and call it a day
  .get("/entries", async ({ cookie: { token }, jwt }) => {
    const token_data = await jwt.verify(token);

    if (!token_data) {
      // TODO: show only public data
      return { message: "Unauthorized" };
    }

    const user_id = token_data.id;

    const entries = await db.entry.findMany({
      where: {
        user_id: user_id,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    return entries;
  })
  .get("/entry/:id", async ({ params, cookie: { token }, jwt }) => {
    // TODO: optionality to skip tags
    const { id } = params;
    const entry = await db.entry.findUnique({
      where: { id: Number(id) },
      include: { tags: true },
    });
    return entry;
  })
  .post(
    "/entry",
    async ({ body, cookie: { token }, jwt }) => {
      // check if the user is authenticated
      const token_data = await jwt.verify(token);

      if (!token_data) {
        // show only public bookmarks
        return { message: "Unauthorized" };
      }

      const { url, type } = body;

      // Check if entry with this URL already exists
      const existingEntry = await db.entry.findUnique({
        where: { url },
      });

      if (existingEntry) {
        return existingEntry;
      }

      // Parse article and create entry
      const articleData = await parseArticle(url);

      return db.entry.create({
        data: {
          user: { connect: { id: token_data.id } },
          url: url,
          title: articleData.title,
          content: articleData.content_md,
          extra: articleData.content_html,
          type: type,
        },
      });
    },
    {
      body: t.Object({
        // TODO: validation will depend on object type!!
        url: t.String(),
        type: t.String(),
      }),
    },
  )
  .post("/note", async ({ body, cookie: { token }, jwt }) => {
    const token_data = await jwt.verify(token);
    if (!token_data) {
      return { message: "Unauthorized" };
    }
    const { text, raw, type } = body as { text: string; raw: any; type: string };
    const title = text.slice(0, 30).trim() || "Untitled Note";
    const uniqueUrl = `note://${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const noteEntry = await db.entry.create({
      data: {
        user: { connect: { id: token_data.id } },
        url: uniqueUrl,
        title: title,
        content: text,
        extra: JSON.stringify(raw),
        type: type || "resource-note",
      },
    });
    return noteEntry;
  })
  .put("/entry/:id", async ({ params, body, cookie: { token }, jwt }) => {
    const token_data = await jwt.verify(token);
    if (!token_data) {
      return { message: "Unauthorized" };
    }

    const user_id = token_data.id;
    const { id } = params;
    const { tags, note } = body;

    const entry = await db.entry.update({
      where: { id: Number(id) },
      // todo: what to update
    });

    // update tags
    async function syncTags(
      user_id: number,
      entry_id: number,
      newTags: string[],
    ) {
      try {
        // Start the transaction
        await db.$transaction(async (db) => {
          // Determine tags to be deleted and deleted them in bulk
          await db.tags.deleteMany({
            where: {
              user_id,
              entry_id,
              NOT: {
                name: { in: newTags },
              },
            },
          });

          // Find out which tags already exist to avoid redundant operations
          const existingTags = await db.tags.findMany({
            where: { user_id, entry_id },
            select: { name: true },
          });
          const existingTagNames = new Set(existingTags.map((tag) => tag.name));

          // Filter out the tags that already exist
          const tagsToCreate = newTags.filter(
            (tag) => !existingTagNames.has(tag),
          );

          // Insert new tags in bulk
          if (tagsToCreate.length > 0) {
            // NOTE: SQLite does not support bulk insert
            // good reason to move into Postgres
            // await db.tags.createMany({
            //   data: tagsToCreate.map(tagName => ({
            //     user_id,
            //     entry_id,
            //     name: tagName,
            //   })),
            //   skipDuplicates: true,
            // });

            // prepare data
            const newTagData = tagsToCreate.map((tagName) => ({
              user_id,
              entry_id,
              name: tagName,
            }));
            // insert data
            await Promise.all(
              newTagData.map((tag) => {
                return db.tags.create({ data: tag });
              }),
            );
          }
        });
      } catch (error) {
        console.error("Failed to sync tags:", error);
        throw error; // Rethrow the error after logging or handling it
      }
    }
    syncTags(user_id, Number(id), tags);

    // TODO: return updated data
    return entry;
  })
  .post("/entry/:id/delete", async ({ params, cookie: { token }, jwt }) => {
    const token_data = await jwt.verify(token);
    if (!token_data) {
      return { message: "Unauthorized" };
    }
    const { id } = params;
    await db.tags.deleteMany({ where: { entry_id: Number(id) } });
    await db.entry.delete({ where: { id: Number(id) } });
    return { message: "Entry deleted successfully" };
  })
  .put("/highlight", async ({ body, cookie: { token }, jwt }) => {
    const token_data = await jwt.verify(token);
    if (!token_data) {
      return { message: "Unauthorized" };
    }
    const { parent_id, text } = body as { parent_id: number; text: string };
    const uniqueUrl = `highlight://${parent_id}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const highlightEntry = await db.entry.create({
      data: {
        user: { connect: { id: token_data.id } },
        url: uniqueUrl,
        title: "Highlight",
        content: text,
        extra: text,
        type: "HIGHLIGHT",
      },
    });
    return { id: highlightEntry.id, ...highlightEntry, parent_id };
  })
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  `Database url is: ${process.env.DATABASE_URL}`,
);

export type App = typeof app;
