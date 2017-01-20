FROM node:7.4.0

COPY package.json /app/package.json

WORKDIR /app

RUN npm install

COPY app/ /app/
