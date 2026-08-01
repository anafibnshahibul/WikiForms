FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM alpine:3.19
WORKDIR /dist
COPY --from=builder /app/dist .
CMD ["sh", "-c", "cp -r /dist/. /output/ && echo '✅ Frontend dist copied'"]
