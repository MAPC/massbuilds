RUN node:alpine

VOLUME /opt/src
WORKDIR /opt/src

COPY package.json .
COPY package-lock.json .

RUN set -ex; \
    \
    npm install

CMD ['npm', 'run', 'start']
