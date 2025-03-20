#####
# Base image
#####
FROM node:22-slim AS node_base
RUN npm install -g pnpm@latest-10
RUN apt update && apt install -y \
    git \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

#####
# Pruner
#####
FROM node_base AS node_pruner
WORKDIR /pruner
COPY . ./
RUN npx turbo prune @resume/api --docker

###
# Node Builder
###
FROM node_base AS node_builder
WORKDIR /builder

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=node_pruner /pruner/out/json/ .
COPY --from=node_pruner /pruner/out/pnpm-lock.yaml ./pnpm-lock.yaml

# NOTE: https://github.com/vercel/turbo/issues/2791
#RUN pnpm install --no-frozen-lockfile
RUN pnpm install --frozen-lockfile

# After installing the dependencies, copy the main code files and build (as they change more often)
COPY --from=node_pruner /pruner/out/full/ .
RUN pnpm turbo run build --filter=...@resume/api

# > The prune command does not support recursive execution on a monorepo currently. To only install production-dependencies in a monorepo node_modules folders can be deleted and then re-installed with pnpm install --prod
# > https://pnpm.io/cli/prune
RUN find . -name "node_modules" -type d -exec rm -rf {} +
RUN pnpm install --prod --frozen-lockfile

###
# Node Runner
###
FROM node_base AS runner
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=node_builder /builder .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "apps/api/dist/index.cjs"]

# docker build -t api -f apps/api/Dockerfile . --progress plain && docker run -p 3000:3000 --env-file .env api
