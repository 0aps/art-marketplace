FROM node:16-alpine

WORKDIR /certificate
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm","start"]