FROM node:16.9.1-alpine AS build

WORKDIR /app

COPY . ./
RUN npm install
RUN npm run verified-build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]