FROM node:16-alpine as pnpm-runner
WORKDIR /app
RUN npm i --location=global pnpm

COPY package* ./

RUN pnpm i

FROM node:16-alpine
WORKDIR /app
COPY --from=pnpm-runner /app/node_modules ./node_modules
COPY . .

CMD ["npm", "start"]