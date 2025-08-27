# --- Stage 1: Build Vite project ---
FROM node:22-alpine AS builder

WORKDIR /app

# System deps for native addons (if any)
RUN apk add --no-cache python3 make g++ && rm -rf /var/cache/apk/*

# Copy lockfiles only for better caching
COPY package.json package-lock.json* ./

# Install deps (prefer npm ci if lockfile exists)
RUN npm config set fund false && npm config set audit false && npm config set registry https://registry.npmjs.org/ && \
    if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --legacy-peer-deps ; \
    else \
      npm install --no-audit --no-fund --legacy-peer-deps ; \
    fi

# Copy source & build
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:1.25-alpine AS production

# Copy custom nginx config (includes SPA fallback)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck endpoint
RUN echo "healthy" > /usr/share/nginx/html/health

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
