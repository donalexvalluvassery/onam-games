FROM node:14

COPY ./package* /project/
WORKDIR /project
RUN npm install
COPY . /project
EXPOSE 8090
CMD [ "node", "index.js" ]