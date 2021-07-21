FROM ruby:2.4.1-alpine
ARG RAILS_ENV
ENV RAILS_ENV=${RAILS_ENV:-development}

RUN echo "Building with RAILS_ENV=${RAILS_ENV}"

WORKDIR /srv/app

RUN apk --update --upgrade add curl-dev libcurl build-base openssh \
	tzdata libxml2 libxml2-dev libxslt libxslt-dev postgresql-dev \
	nodejs shared-mime-info

# Add Yarn to the mix
# hideous hack by matz. methinks yarn lastest tarball changed.
# to something dumb that will change each version
# previously would untar to a directory called yarn, now yarn-v1.0.1
# so below mv /opt/yarn-* hopefully will catch new version numbers

RUN apk add --no-cache curl && \
  mkdir -p /opt && \
  curl -sL https://yarnpkg.com/latest.tar.gz | tar xz -C /opt && \
  mv /opt/yarn-* /opt/yarn && \
  ln -s /opt/yarn/bin/yarn /usr/local/bin && \
  apk del --purge curl

COPY Gemfile* /srv/app/


RUN if [ ${RAILS_ENV} = 'production' ]; then \
	bundle install --without development test --deployment; \
else \
	bundle install; \
fi

COPY package.json /srv/app/
COPY yarn.lock /srv/app/
RUN yarn install

COPY . /srv/app/

RUN if [ ${RAILS_ENV} = 'production' ]; then \
	bundle exec rake webpacker:compile; \
fi

EXPOSE 3000

#TODO apparently cannot use variable in CMD instruction, but i hate the 5000 here!
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
