import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client"
import { swagger } from "@elysiajs/swagger"
import { cors } from '@elysiajs/cors'
import { parseArticle } from "../parse";

const BASE_URL = process.env.BASE_URL || ""

const db = new PrismaClient()
const app = new Elysia({ prefix: BASE_URL })
.get("/", () => "Hello Elysia")
.use(swagger())
.use(cors()) // TODO: fix before production
.get("/bookmarks", async () => {
  const bookmarks = await db.userBookmark.findMany({
    where: {
      user_id: 1,
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
    },
    orderBy: {
      created_at: 'asc',
    },
  });
  return bookmarks;
})
.get("/bookmark/:id", async ({ params }) => {
  const { id } = params;
  const bookmark = await db.bookmark.findUnique({
    where: { id: Number(id) },
  });
  return bookmark;
})
.post("/bookmark", async ({ body }) => {
  // TODO: check if the user is authenticated
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
  return db.userBookmark.create({
    data: {
      user: { connect: { id: 1 }},
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

.listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
