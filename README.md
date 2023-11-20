# Engineering

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

API for build (production) is set to /api, db is prod.db
for dev it's localhost:8000, db is dev.db

Releasing new version
```
git pull

# client-side
cd client
bun install # if additional libraries
bun run build

# server side
cd server
sudo kill -9 $(lsof -t -i:8000) # kill the current nohup server process
bun install  # if additional libraries
bunx prisma migrate deploy
bunx prisma generate
bun run prod # test if runs, kill it if anyway
nohup bun run prod
```


Read more
- [Generating Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)




