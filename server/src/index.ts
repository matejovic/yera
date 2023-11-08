import { Elysia, t } from "elysia";
import { Prisma, PrismaClient } from "@prisma/client"
import { swagger } from "@elysiajs/swagger"
import { cors } from '@elysiajs/cors'
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'
import { parseArticle } from "../parse";
import { auth } from "./auth";

const BASE_URL = process.env.BASE_URL || ""



let corsConfig = {
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

if (process.env.NODE_ENV === 'development') {
  corsConfig.origin = 'localhost:5173'
}

 
const db = new PrismaClient();

const app = new Elysia({ prefix: BASE_URL })
.use(cookie())
.use(auth)
.use(
  jwt({
    name: 'jwt',
    // This should be Environment Variable
    secret: 'MY_SECRETS',
    exp: "7d"
  })
)
.use(swagger())
.use(cors(
  corsConfig
)) // TODO: fix before production

.get("/bookmarks", async ({ cookie: { token }, jwt }) => {

  const token_data = await jwt.verify(token);

  if (!token_data) {
    // show only public bookmarks
    return { message: "Unauthorized" };
  }

  const bookmarks = await db.userBookmark.findMany({
    where: {
      user_id: token_data.id,
    },
    select: {
      bookmark: {
        select: {
          id: true,
          url: true,
          title: true,
          published_at: true,
        },
      },
      created_at: true,
      tags: true,
    },
    orderBy: {
      created_at: 'asc',
    },
  });
  return bookmarks;
})
.get("/fast-bookmark/:id", async ({ params }) => {
  const { id } = params;
  const bookmark = await db.bookmark.findUnique({
    where: { id: Number(id) },
  });
  return bookmark;
})
.get("/bookmark/:id", async ({ params, cookie: { token }, jwt }) => {
  const { id } = params;
  const bookmark = await db.userBookmark.findUnique({
    where: { user_id_bookmark_id: { user_id: 1, bookmark_id: Number(id) } },
    include: { bookmark: true, tags: true },
  });
  return bookmark;
})
.post("/bookmark", async ({ body, cookie: { token }, jwt }) => {
  // check if the user is authenticated
  const token_data = await jwt.verify(token);

  if (!token_data) {
    // show only public bookmarks
    return { message: "Unauthorized" };
  }

  const { url } = body;

  // TODO: check if the bookmark already exists
  // if yes, check if UserBookmark exists (for id=1), if yes, return it
  // if UserBookmark does not exist, create it and return it

  // we can do this in a separate worker thread
  const articleData = await parseArticle(url);
  
  // store data in the database
  const bookmarkData = {
    url: url,
    title: articleData.title,
    content_md: articleData.content_md,
    content_html: articleData.content_html
  }
  
  // we need to return prisma Promise, not the data
  // TODO: this fails on duplicate url (unique constraint)
  return db.userBookmark.create({
    data: {
      user: { connect: { id: token_data.id }},
      bookmark: { create: bookmarkData },
      annotations: 'fixme',
    },
    include: { bookmark: true }
  })

}, {
  body: t.Object({
    url: t.String(),
  })
})
.put("/bookmark/:id", async ({ params, body, cookie: {token}, jwt }) => {
  
  const token_data = await jwt.verify(token);
  if (!token_data) {
    return { message: "Unauthorized" };
  }
  
  const user_id = token_data.id;
  const { id } = params;
  const { tags, note } = body;

  const userBookmark = await db.userBookmark.update({
    where: { user_id_bookmark_id: { user_id: user_id, bookmark_id: Number(id) } },
    data: { annotations: note },
  });

  // update tags
  async function syncTags(user_id: number, bookmark_id: number, newTags: string[]) {
    try {
      // Start the transaction
      await db.$transaction(async (db) => {
        // Determine tags to be deleted and deleted them in bulk
        await db.tags.deleteMany({
          where: {
            user_id,
            bookmark_id,
            NOT: {
              name: { in: newTags },
            },
          },
        });
  
        // Find out which tags already exist to avoid redundant operations
        const existingTags = await db.tags.findMany({
          where: { user_id, bookmark_id },
          select: { name: true },
        });
        const existingTagNames = new Set(existingTags.map(tag => tag.name));
  
        // Filter out the tags that already exist
        const tagsToCreate = newTags.filter(tag => !existingTagNames.has(tag));
  
        // Insert new tags in bulk
        if (tagsToCreate.length > 0) {
          // NOTE: SQLite does not support bulk insert
          // good reason to move into Postgres
          // await db.tags.createMany({
          //   data: tagsToCreate.map(tagName => ({
          //     user_id,
          //     bookmark_id,
          //     name: tagName,
          //   })),
          //   skipDuplicates: true,
          // });
          
          // prepare data
          const newTagData = tagsToCreate.map(tagName => ({
            user_id,
            bookmark_id,
            name: tagName,
          }))
          // insert data
          await Promise.all(newTagData.map(tag => {
            return db.tags.create({ data: tag})
          }));

        }
      });
    } catch (error) {
      console.error('Failed to sync tags:', error);
      throw error; // Rethrow the error after logging or handling it
    }
  }
  syncTags(user_id, Number(id), tags);  

  // TODO: return updated data
  return userBookmark;
})

.listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  `Database url is: ${process.env.DATABASE_URL}`
);


export type App = typeof app;