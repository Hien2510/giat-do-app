FROM node:20-alpine
WORKDIR /app
COPY . .
RUN rm -f ._* && mkdir -p public && (mv index.html manifest.webmanifest *.png public/ 2>/dev/null || true)
ENV DATA_DIR=/data PORT=3000
VOLUME /data
EXPOSE 3000
CMD ["node","server.js"]
