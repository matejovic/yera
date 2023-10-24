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
  return {
    data: {
      url: url,
      user_id: 1,
      title: articleData.title,
      content_md: articleData.content,
    }
  }

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
