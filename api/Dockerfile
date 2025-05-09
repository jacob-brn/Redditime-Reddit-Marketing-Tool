# # api/Dockerfile

# FROM node:20-alpine

# WORKDIR /app

# # Install dependencies inside container (on Linux)
# COPY package*.json ./
# RUN npm ci

# # Now copy the rest of the app (excluding node_modules)
# COPY . .

# EXPOSE 8080

# CMD ["npm", "run", "start"]

FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app

COPY package*json tsconfig.json drizzle.config.ts src ./

RUN apk add --no-cache gcompat && \
    npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono && \ 
    chmod 777 /app

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json


USER hono
EXPOSE 8080
CMD npm run start