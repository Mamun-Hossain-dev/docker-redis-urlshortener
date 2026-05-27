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

# ------------------
# multi stage Dockerfile
# -------------------

# stage 1: build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# stage 2: create the production image
FROM node:20-alpine AS runner
