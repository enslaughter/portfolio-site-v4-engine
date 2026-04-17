ARG NODE_VERSION=24.14.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

FROM base as deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM deps as build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base as final
ENV NODE_ENV production
USER node
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 8080
CMD npm start
