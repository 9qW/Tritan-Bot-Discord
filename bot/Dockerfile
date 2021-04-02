FROM node:14.16.0

WORKDIR /opt/tritan-bot

COPY . .

RUN npm install
RUN npm update
RUN npm audit fix

EXPOSE 65535

CMD [ "node", "index.js" ]
