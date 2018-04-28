FROM node:8.9.4-alpine as build

RUN mkdir /opt/app
WORKDIR /opt/app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn
COPY . .
RUN yarn build:browser

FROM nginx:1.13.12-alpine as prod

COPY --from=build /opt/app/www /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
