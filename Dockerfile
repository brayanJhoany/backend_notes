# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./


# RUN apk add --no-cache make gcc g++ python && \
#     npm install && \
#     npm rebuild bcrypt --build-from-source && \
#     apk del make gcc g++ python
# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
