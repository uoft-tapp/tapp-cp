FROM ruby:2.4.1-alpine

WORKDIR /srv/app

RUN apk --update --upgrade add curl-dev build-base openssh \
	tzdata libxml2 libxml2-dev libxslt libxslt-dev postgresql-dev \
	nodejs

# Add Yarn to the mix
RUN apk add --no-cache curl && \
  mkdir -p /opt && \
  curl -sL https://yarnpkg.com/latest.tar.gz | tar xz -C /opt && \
  mv /opt/dist /opt/yarn && \
  ln -s /opt/yarn/bin/yarn /usr/local/bin && \
  apk del --purge curl

COPY Gemfile* /srv/app/
RUN bundle install

COPY package.json /srv/app/
COPY yarn.lock /srv/app/
RUN yarn install

COPY . /srv/app/

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
