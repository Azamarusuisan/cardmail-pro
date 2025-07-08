# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install production dependencies only
RUN npm ci --production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/dist ./server/dist

# Expose port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]