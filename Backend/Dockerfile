FROM node:20-slim

WORKDIR /app

COPY ./package*.json ./

RUN npm install --no-cache

COPY . .

CMD [ "npm", "start" ]