FROM node:20-alpine

# Set working directory
WORKDIR /app

# Define build arguments
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL

# Set environment variables for both build and runtime
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy source code
COPY . .

# Build the application with environment variables available
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
