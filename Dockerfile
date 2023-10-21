FROM node:lts-alpine AS base

RUN corepack enable

COPY . /app
WORKDIR /app

ENV PORT=3000
ENV MONGODB_URI="mongodb+srv://admin:kwomWd0afSdpxnm5@development.bqocrp5.mongodb.net/"
ENV MONGODB_DB=development
ENV ALGOLIA_API_KEY="2cc6aadc1d9b75048dc135f058155c08"
ENV ALGOLIA_APPLICATION_ID="9T02IX7HGQ"

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm exec nx run monolith:build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 3000
CMD node ./dist/apps/monolith/main.js