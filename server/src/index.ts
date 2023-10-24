import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client"
import { swagger } from "@elysiajs/swagger"
import { cors } from '@elysiajs/cors'
import { parseArticle } from "../parse";

function parseUrl(url: string) {
  // Options: mozilla/readability, postlight/parser
  // https://github.com/mozilla/readability
  // let's give this a try


  // https://github.com/postlight/parser
  // seems to err on bun. Should work with NPM or deno though
  // Parser.parse(url).then((result) => {
  //   console.log(result.title);
  //   console.log(result.content);
  // });


}

const db = new PrismaClient()
const app = new Elysia()
.get("/", () => "Hello Elysia")
.use(swagger())
.use(cors()) // TODO: fix before production
.post("/bookmark", async ({ body }) => {
  // TODO: check if the user is authenticated
  const { url } = body;

  // perform url fetching, can happen async for faster response

  // TODO: check if the bookmark already exists
  // TODO: only update the annotation if it's different

  const articleData = await parseArticle(url);
  
  // store data in the database
  const bookmarkData = {
    url: url,
    title: articleData.title,
    content_md: articleData.content_md,
    content_html: articleData.content_html
  }
  
  // fails silently
  db.userBookmark.create({
    data: {
      user: { connect: { id: 1 }},
      bookmark: { create: bookmarkData },
      annotations: 'fixme',
    },
    include: { bookmark: true }
  })
  
  return {
    data: {
      url: url,
      user_id: 1,
      ...bookmarkData
    }
  }
  
  // An operation failed because it depends on one or more records that were required but not found. 
  // No 'User' record(s) (needed to inline the relation on 'UserBookmark' record(s)) was found for a nested 
  // connect on one-to-many relation 'UserToUserBookmark'.

  // return db.userBookmark.create({
  //   data: {
  //     user: {
  //       connect: {
  //         id: user_id
  //       }
  //     },
  //     bookmark: {
  //       create: {
  //         url: url
  //       }
  //     },
  //     annotations: annotation
  //   },
  //   include: {
  //     bookmark: true
  //   }
  // });

}, {
  body: t.Object({
    url: t.String(),
  })
})

.listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
