FROM node:16-alpine

WORKDIR /identity
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm","start"]