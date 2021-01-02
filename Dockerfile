FROM node:10

RUN mkdir /backend

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "server.js" ]