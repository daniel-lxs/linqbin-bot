FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY drizzle drizzle
COPY tsconfig.json .

VOLUME /app

RUN bun run run-migrations

RUN bun run build
COPY dist dist

COPY db/db.sqlite .

ENV NODE_ENV production
CMD ["bun", "dist/index.js"]

EXPOSE $PORT
