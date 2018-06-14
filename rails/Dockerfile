FROM ruby:2.4.2
MAINTAINER Eric Youngberg <eyoungberg@mapc.org>

WORKDIR /usr/src/app
VOLUME /usr/src/app
EXPOSE 3000

COPY Gemfile* ./

RUN set -ex \
    ; \
    apt-get update -qq \
    && apt-get install -y --no-install-recommends nodejs \
    ; \
    bundle install

CMD ["rails", "server", "-b", "0.0.0.0"]
