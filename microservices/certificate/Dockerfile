FROM node:16-alpine

WORKDIR /certificate
COPY package*.json ./
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]