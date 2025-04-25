FROM node:20

WORKDIR /srv/node/app

RUN npm install -g tsx nodemon drizzle-kit

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R node /srv/node/app
USER node

EXPOSE 3000
EXPOSE 9229

CMD ["sh", "-c", "npm run migrate && npm run dev"]
