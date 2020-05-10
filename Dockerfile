FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production

CMD ["yarn", "start"]