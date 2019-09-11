FROM node:8.7.0-alpine

# create app diectory and use it as the working directory

RUN mkdir -p /srv/app/''name''
WORKDIR /srv/app/''name''
COPY package.json /srv/app/''name''
COPY package-lock.json /srv/app/''name''
 
RUN npm install
COPY . /srv/app/''name''

CMD ["npm","run","dev"]

