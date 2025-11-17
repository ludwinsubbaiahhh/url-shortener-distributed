# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY frontend/ ./

# Build Next.js application
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Copy necessary Next.js files
COPY --from=build /app/next.config.* ./
COPY --from=build /app/tsconfig.json ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start Next.js
CMD ["npm", "run", "start"]

