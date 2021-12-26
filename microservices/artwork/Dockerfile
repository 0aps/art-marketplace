FROM node:16-alpine

WORKDIR /artwork
COPY package*.json ./
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]