FROM node:16.9.1-alpine AS build
RUN apk --no-cache add git

WORKDIR /app

COPY . ./
ARG ENV_FILE=devnet.env
RUN cp $ENV_FILE .env
RUN cat .env
RUN yarn
RUN yarn verified-build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]