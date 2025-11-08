FROM node:20.12.2

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8060

CMD ["npm", "run", "start"]