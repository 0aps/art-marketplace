FROM node:16-alpine

WORKDIR /payment
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm","start"]