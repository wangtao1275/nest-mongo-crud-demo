FROM daocloud.io/library/node:14.11-stretch-slim

# config npm config registry to taobao
RUN npm config set registry https://registry.npm.taobao.org

# create dir
RUN mkdir -p /usr/src/app

ADD . /usr/src/app

# Create app directory
WORKDIR /usr/src/app

RUN npm install
# If you are building your code for production
RUN npm run build

EXPOSE 3001
CMD [ "node", "dist/main" ]
