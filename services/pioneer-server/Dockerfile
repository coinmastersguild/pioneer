FROM node:10.18

ARG NPM_TOKEN
ARG NODE_ENV

RUN apt update && apt install wget libudev-dev libusb-1.0-0 -y

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

RUN echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > /usr/src/app/.npmrc
RUN npm --version

RUN npm install -g @quasar/cli
RUN npm install


COPY . /usr/src/app
RUN npm run build:all-stage

ENV NODE_ENV docker


#build
#CMD [ "npm", "run", "build:all-stage" ]

#start
CMD [ "npm", "run", "start" ]