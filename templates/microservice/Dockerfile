# Stage 1: Build
FROM node:22-alpine AS build

RUN --mount=type=secret,id=github_token \
  npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/github_token)

WORKDIR /app

# Shared typescript configs
COPY tsconfig.json ./
COPY backend/tsconfig.json ./backend/

WORKDIR /app/backend/RENAME

COPY backend/RENAME/package*.json backend/RENAME/.npmrc ./

RUN npm ci

COPY backend/RENAME .

RUN npm run build

RUN npm prune --omit=dev

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/backend/RENAME/dist ./dist
COPY --from=build /app/backend/RENAME/node_modules ./node_modules
COPY --from=build /app/backend/RENAME/package.json .

HEALTHCHECK --interval=3s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npm", "run", "start:prod"]
