FROM node:20-slim

# install dependencies
RUN apt-get update && \
apt-get install -y ffmpeg yt-dlp && \
apt-get clean

# set working directory
WORKDIR /app

# copy package files
COPY package*.json ./

# install node modules
RUN npm install

# copy project files
COPY . .

# railway port
EXPOSE 3000

# start server
CMD ["node", "server.js"]