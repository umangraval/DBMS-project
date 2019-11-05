FROM  node:9-slim
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install
CMD ["npm","start"]