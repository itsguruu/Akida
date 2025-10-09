# Use a modern and supported Node.js image
FROM node:18-bullseye

# Use root for installing system packages
USER root

# Update system and install dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg webp git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install npm dependencies
RUN npm install -g pm2 && npm install

# Copy the rest of your source code
COPY . .

# Expose port (required by Render)
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start your bot
CMD ["pm2-runtime", "index.js", "--name", "Akida"]
