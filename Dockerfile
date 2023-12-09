# base stage
FROM node:18-bullseye-slim as base

ENV NODE_ENV production

RUN apt-get update && apt-get install -y openssl

# deps stage: Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /web-project

ADD package.json ./

RUN npm install --include=dev

# production-deps stage
FROM base as production-deps

WORKDIR /web-project

COPY --from=deps /web-project/node_modules /web-project/node_modules
ADD package.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /web-project

COPY --from=deps /web-project/node_modules /web-project/node_modules 

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

FROM base

WORKDIR /web-project
COPY --from=production-deps /web-project/node_modules /web-project/node_modules
COPY --from=build /web-project/build /web-project/build
ADD . .

CMD ["npm", "start"]



