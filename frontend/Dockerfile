# Stage 1: Build
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . ./

# Build Next.js application
RUN npm run build

# Stage 2: Production
FROM node:20 AS production
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

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

