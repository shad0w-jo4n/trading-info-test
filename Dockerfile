FROM node:16-alpine AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS dependencies
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --production

FROM node:16-alpine AS production
EXPOSE 3000
WORKDIR /app
COPY package.json .
COPY migrations ./migrations
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
ENTRYPOINT npm run start
