# Reference: https://github.com/nodeshift-starters/devfile-sample/blob/main/Dockerfile

# Install the app dependencies in a full Node docker image
FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-16:latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the dependencies into a Slim Node docker image
FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-16-minimal:latest

# Install app dependencies
COPY --from=0 /opt/app-root/src/node_modules /opt/app-root/src/node_modules
COPY . /opt/app-root/src

ENV NODE_ENV production

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "start"]
