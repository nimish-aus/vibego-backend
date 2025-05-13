# Use Node base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port (default for Cloud Run is 8080)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]