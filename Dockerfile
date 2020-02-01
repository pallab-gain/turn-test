FROM node:13
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD [ "npm", "run", "start" ]
