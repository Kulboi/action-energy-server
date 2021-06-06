FROM node:10-alpine

LABEL version="1.0"
LABEL description="This is the base docker image for action energy accounts server app."
LABEL maintainer = ["habeeb.maciver@aiesec.net"]

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7000

CMD ["npm", "start"]