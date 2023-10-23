FROM node:lts-alpine AS base

RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm exec nx run-many --target=build --projects=middlewares,models,monolith,repositories,utilities 

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD node ./dist/apps/monolith/main.js