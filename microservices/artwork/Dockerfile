FROM node:16-alpine

WORKDIR /artwork
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm","start"]