FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

# install yt-dlp + ffmpeg
RUN apt-get update && \
apt-get install -y ffmpeg python3 python3-pip && \
pip3 install yt-dlp

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]