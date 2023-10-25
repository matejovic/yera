## Run the project

Run the client
```
cd client
bun install
bun run dev
```

Run the server
```
cd server
bun install
bunx prisma generate
bun run dev
```

## Releasing
On the client we run `bun run build` instead of `dev`. It will generate `dist` folder.

API for build (production) is set to /api
for dev it's localhost:8000


Read more
- [Generating Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)


## Project Management

MVP we aim for 
- link with all the useful parsed data is stored in the db
- I will need a refactoring day

Client
- loader and toast messages
- modal with the clean article is displayed 
- new item is added to the list without the need to refresh
- add themes
- design the reading app (font type, size, colours)
- how hard to integrate TTS api? estimate. (#ai-integrations)

## Programmer's notes

Proposed tasks
-[ ] mail goal: release working demo on the server
-[ ] fix the reading xp work on the phone
-[ ] catch external links before opening them and offer options: save this link, open in new tab.

once basics are done

Completed tasks
-[x] add newly added article to the main feed on response
-[x] So what I need to do first is to display proper article
-[x] Actually add article into the database
-[x] Display real data instead of fake on the homepage. 
-[x] Open article modal on article box click


## Found bugs
Wide images can break the layout. E.g. https://github.com/josStorer/chatGPTBox
- solve this by adding a max-width to the images
- can be improved by adding display large image feature