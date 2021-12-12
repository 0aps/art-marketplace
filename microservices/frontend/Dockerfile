FROM node:16-alpine

WORKDIR /frontend
COPY package*.json ./
RUN npm install --only=prod
COPY . .

CMD ["npm","build"]