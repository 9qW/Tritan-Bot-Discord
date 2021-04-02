FROM node:14.16.0

WORKDIR /opt/tritan-web
COPY . .

RUN npm install
RUN npm update
RUN npm audit fix

EXPOSE 80

CMD [ "node", "index.js"]
