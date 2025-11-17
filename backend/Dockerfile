# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./backend/

# Install root dependencies
RUN npm install

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./backend/

# Install root dependencies (for build tools)
RUN npm install

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy source code
COPY backend/ ./

# Copy Prisma schema
COPY backend/prisma ./prisma/

# Generate Prisma client
RUN npx -r dotenv/config prisma generate

# Build all applications
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./backend/

# Install only production dependencies
RUN npm ci --omit=dev

WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
COPY backend/prisma ./prisma/
RUN npx prisma generate

# Copy built applications
COPY --from=build /app/backend/dist ./dist

# Expose ports (adjust as needed)
EXPOSE 3001 3002 3003

# Run all three services
CMD node dist/apps/url-service/main.js & node dist/apps/analytics-service/main.js & node dist/apps/worker-service/main.js & wait

