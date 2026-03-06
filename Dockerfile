FROM node:18

RUN apt-get update && \
apt-get install -y ffmpeg python3 yt-dlp && \
rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node","server.js"]