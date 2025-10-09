# Base image with Node.js 18 (recommended for Baileys)
FROM node:18-buster

# Set working directory
WORKDIR /home/node/app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y git ffmpeg wget curl && \
    rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Install node modules
RUN npm install --legacy-peer-deps

# Fix permission issues for node
RUN chmod -R 777 /home/node/app

# Expose Render/Express port
EXPOSE 7860

# Start your bot
CMD ["node", "index.js"]
