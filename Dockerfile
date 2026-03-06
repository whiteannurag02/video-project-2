FROM node:18

RUN apt-get update && \
apt-get install -y ffmpeg python3 python3-pip && \
pip3 install yt-dlp --break-system-packages

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node","server.js"]