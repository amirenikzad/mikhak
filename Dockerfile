FROM 192.168.13.252:5050/node:22-alpine as builder

#FROM gitlab.local:5005/mikhak/front/ui/microservice/dezhban-ui-staging:2.9.131-beta-TZa1oUIMFR as builder

# FROM node:22-alpine as builder
# FROM 192.168.13.252:5050/node:22-alpine as builder
# FROM 192.168.13.79:5052/node:24.0.0-alpine as builder
ENV NODE_ENV development
#!RUN apk add --no-cache curl iputils



WORKDIR /app
COPY . .
COPY build.sh ./build.sh

RUN chmod +x ./build.sh

RUN npm config list

RUN ./build.sh

FROM 192.168.13.252:5050/nginx:1.27.1-alpine as production
#FROM nginx:1.27.1-alpine as production
ENV NODE_ENV production
#RUN apk add --no-cache nginx-mod-http-brotli
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
