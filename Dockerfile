# Build the project within a container
FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY . .
RUN npm run build

# Create a container to run the project
FROM node:16-alpine
ENV NODE_ENV=production
RUN addgroup app && adduser -S -G app app
RUN mkdir -p /usr/src/app && chown -R app:app /usr/src/app
USER app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY --from=builder /usr/src/app/bin/ ./
EXPOSE 4000
CMD ["node", "index.js"]
