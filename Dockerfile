# Use the official Node.js image as the base image
FROM node:22-alpine
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev
RUN npm install pg pg-hstore

# Copy the rest of the application code to the working directory
COPY . .
# التأكد من وجود مجلدات الرفع أو أي مجلدات بيانات
RUN mkdir -p uploads
# Expose port 3000 for the application
EXPOSE 3000
# Start the application
CMD ["node", "index.js"]