FROM node:16-alpine

WORKDIR /order
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm","start"]