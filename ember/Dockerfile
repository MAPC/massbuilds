RUN node:alpine

VOLUME /opt/src
WORKDIR /opt/src

COPY . .

RUN set -ex \
    ; \
    apk add --no-cache \
      git \
      gcc \
      g++ \
      make \
      libtool \
      binutils \
      autoconf \
      automake \
      libffi-dev \
      openssl-dev \
      linux-headers \
    ; \
    git clone https://github.com/facebook/watchman \
    && cd watchman \
    && git checkout v4.9.0 \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install

RUN set -ex \
    ; \
    npm install -g ember-cli \
    && npm install

CMD ["npm", "run", "start"]
