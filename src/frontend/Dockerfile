FROM node:24-alpine AS build

WORKDIR /app
COPY code/package*.json ./
RUN npm install
COPY code/ .
RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
