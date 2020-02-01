FROM node:13
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install -g typescript
RUN npm ci
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
