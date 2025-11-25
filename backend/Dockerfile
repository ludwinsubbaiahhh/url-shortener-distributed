# Stage 1: Build
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (needed for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . ./

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client (set dummy DATABASE_URL for config file, not actually used)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build all applications explicitly
RUN npx nest build url-service && \
    npx nest build analytics-service && \
    npx nest build worker-service

# Stage 2: Production
FROM node:20 AS production
WORKDIR /app

# Copy package files and updated lock file from build stage
COPY package.json ./
COPY --from=build /app/package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy Prisma schema and generate client (set dummy DATABASE_URL for config file)
COPY prisma ./prisma/
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Copy built applications
COPY --from=build /app/dist ./dist

# Expose ports (adjust as needed)
EXPOSE 3001 3002 3003

# Default command (will be overridden in docker-compose)
CMD ["node", "dist/apps/url-service/main.js"]
