FROM node:alpine3.22

WORKDIR /usr/src/webapp

COPY ./app/package*.json .

RUN npm install

COPY ./app/docs .

CMD ["npm","run","dev"]
