# FROM node:alpine as builder

FROM node:16-alpine3.11 as builder

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# fix npm private module
#ARG NPM_TOKENsd
#COPY .npmrc /usr/src/app/
#COPY package.json package.json
COPY package*.json /usr/src/app/

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
#RUN npm cache clean --force
RUN npm install
# RUN rm -f .npmrc

RUN npm run build
#CMD [ "npm", "run", "build" ]

#CMD ng serve --host 0.0.0.0
#CMD [ "npm", "run", "start" ]

#RUN docker login --username vedantsingh123 --password "Kpk=:aC8/9m2(%s"

# FROM public.ecr.aws/nginx/nginx
## Remove default ng
#WORKDIR /usr/src/app
#COPY --from=builder /usr/src/app/dist/ .

RUN rm -rf /usr/share/nginx/html/*
## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/dist/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
