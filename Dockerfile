# Use a modern and supported Node.js image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy package files first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install -g pm2 && npm install

# Install required system packages
RUN apt-get update && \
    apt-get install -y ffmpeg webp git && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the source code
COPY . .

# Expose a port (needed by Render)
EXPOSE 3000

# Run your bot using PM2
CMD ["pm2-runtime", "index.js", "--name", "Akida"]
