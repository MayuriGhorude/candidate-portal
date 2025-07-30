# Use official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only production for lean containers)
RUN npm ci --only=production

# Copy rest of your backend code
COPY . .

# Create uploads directory for file uploads
RUN mkdir -p uploads

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose API port
EXPOSE 5000

# Start Express server
CMD ["npm", "start"]

