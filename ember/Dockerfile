FROM node:8-alpine
MAINTAINER Eric Youngberg <eyoungberg@mapc.org>

WORKDIR /opt/src
EXPOSE 4200

COPY package* ./

RUN set -ex \
    ; \
    npm install -g ember-cli \
    && npm install

VOLUME /opt/src/node_modules

CMD ["npm", "run", "start"]
