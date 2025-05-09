# api/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install dependencies inside container (on Linux)
COPY package*.json ./
RUN npm install --force

# Now copy the rest of the app (excluding node_modules)
COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
