FROM node:16-alpine

WORKDIR /usr/frontend/

COPY . .

RUN sed '/proxy: http/d' package.json

RUN npm i

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npx", "serve", "-s", "--listen", "3000", "./build/"]
