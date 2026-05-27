# single stage Dockerfile
# FROM node:24-alpine

# LABEL maintainer="mh4559641@gmail.com"

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build && npm prune --omit=dev

# ENV NODE_ENV=production

# EXPOSE 3000

# CMD [ "node", "dist/index.js"]

# stage 1: install all deps for build
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# stage 2: build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build
RUN npm prune --omit=dev

# stage 3: create the production image
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY public/ ./public
COPY views/ ./views

EXPOSE 3000
CMD [ "node", "dist/index.js" ]
