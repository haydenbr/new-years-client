FROM node:8.9.4-alpine
LABEL maintainer="Unboxed Technology LLC, https://haydenbr.com"
LABEL author="Hayden Braxton, haydenbraxton@haydenbr.com"

# ENV or ARG?
# 
# https://docs.docker.com/engine/reference/builder/#arg
# https://docs.docker.com/engine/reference/builder/#env
# 
# TL;DR both are ENV variables. ARG can be overwritten at build time
ENV NODE_ENV=development

# update system level tools I need
RUN mkdir /opt/app && \
		apk update && \
		apk add --no-cache ncftp=3.2.6-r1 && \
		rm -r /var/cache/apk
WORKDIR /opt/app

# install dependencies
# COPY or ADD?
# 
# https://docs.docker.com/engine/reference/builder/#add
# https://docs.docker.com/engine/reference/builder/#copy
# 
# TL;DR they do the same thing, except ADD can pull from remote resources
ADD docker/package.json package.json
ADD yarn.lock yarn.lock
RUN yarn

# expose ports to serve app from inside container
EXPOSE 8100 35729 53703
# default command to run when starting the container
# can overwrite with --entrypoint or pass additional args
CMD [ "yarn", "serve" ]
