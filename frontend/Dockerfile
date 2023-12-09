FROM node:18

RUN mkdir /frontend

WORKDIR /frontend

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]