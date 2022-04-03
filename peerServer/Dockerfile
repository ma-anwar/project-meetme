FROM node:16-alpine

WORKDIR /usr/peerserver/

COPY package*.json ./

COPY . .

RUN npm install --no-audit

EXPOSE 5000

 CMD  ["npm", "run", "start"]
