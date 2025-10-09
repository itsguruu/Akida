# Use a modern Node.js version with Debian Bookworm (not Buster)
FROM node:18-bookworm

# Set working directory
WORKDIR /home/node/app

# Install required system packages
RUN apt-get update && \
    apt-get install -y git ffmpeg wget curl && \
    rm -rf /var/lib/apt/lists/*

# Copy all files from your repo into the container
COPY . .

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Make sure the app files are executable
RUN chmod -R 777 /home/node/app

# Set timezone if needed (you can edit)
ENV TZ=Africa/Nairobi

# Expose the bot’s default port (can change if needed)
EXPOSE 7860

# Start your bot
CMD ["node", "index.js"]
