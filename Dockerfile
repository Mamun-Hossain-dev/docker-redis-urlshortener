FROM node:24-alpine

LABEL maintainer="mh4559641@gmail.com"

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", "src/index.js"]
