#STEP 1
FROM node:12.18.1-alpine AS build
WORKDIR /client-app
COPY package.json ./

RUN npm install
COPY . .
RUN npm run build

# STEP 2
FROM nginx:1.19.0-alpine  AS prod-stage
COPY --from=build /client-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]