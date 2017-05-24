FROM ruby:2.4.1-alpine

WORKDIR /srv/app

RUN apk --update --upgrade add curl-dev build-base openssh \
	tzdata libxml2 libxml2-dev libxslt libxslt-dev sqlite-dev nodejs

COPY Gemfile* /srv/app/
RUN bundle install

COPY . /srv/app/

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
