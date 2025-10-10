# Use Node 20 for WebCrypto compatibility (required by Baileys)
FROM node:20-bullseye

# Set working directory
WORKDIR /home/node/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all remaining source files
COPY . .

# Enable WebCrypto globally for Baileys
ENV NODE_OPTIONS="--experimental-global-webcrypto"

# Expose default port for Render (can be any open port)
EXPOSE 7860

# Healthcheck to keep the container alive on Render
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:7860', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1));"

# Keep the app running and auto-restart if it crashes
CMD ["bash", "-c", "while true; do node index.js || true; sleep 2; done"]
