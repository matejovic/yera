# Run the project

## Development
```
bun install # if any new libraries
bunx prisma generate (schema change)
bun run dev
```

This will run on `localhost:8000` with live-reload.

## Production
```
sudo kill -9 $(lsof -t -i:8000) # kill the current nohup server process
bun install  # if additional libraries
bunx prisma migrate deploy
bunx prisma generate
bun run prod # test if runs, kill it.
nohup bun run prod
```

It will be accessible at `/api`
And it will use `prod.db` (based on env variable)

# Read more
- [Generating Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
