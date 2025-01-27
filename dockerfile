# Dockerfile
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/shared/package.json ./apps/shared/
COPY apps/math-lib/package.json ./apps/math-lib/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN yarn install

# Copy source files
COPY tsconfig.json ./
COPY apps/shared/tsconfig.json ./apps/shared/
COPY apps/shared/src ./apps/shared/src
COPY apps/math-lib/tsconfig.json ./apps/math-lib/
COPY apps/math-lib/src ./apps/math-lib/src
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src
COPY apps/frontend/tsconfig.json ./apps/frontend/
COPY apps/frontend/tsconfig.app.json ./apps/frontend/
COPY apps/frontend/tsconfig.node.json ./apps/frontend/
COPY apps/frontend/src ./apps/frontend/src
COPY apps/frontend/index.html ./apps/frontend/
COPY apps/frontend/vite.config.ts ./apps/frontend/

# Build packages in order
RUN yarn workspace @calcu-bot/shared build && \
    yarn workspace @calcu-bot/math-lib build && \
    yarn workspace @calcu-bot/backend build && \
    yarn workspace @calcu-bot/frontend build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/shared/package.json ./apps/shared/
COPY apps/math-lib/package.json ./apps/math-lib/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Copy built files
COPY --from=builder /app/apps/shared/dist ./apps/shared/dist
COPY --from=builder /app/apps/math-lib/dist ./apps/math-lib/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/frontend/dist ./apps/backend/frontend
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist

# Install production dependencies only
RUN corepack enable && \
    yarn workspaces focus @calcu-bot/backend --production

EXPOSE 3000

CMD ["yarn", "workspace", "@calcu-bot/backend", "start"]