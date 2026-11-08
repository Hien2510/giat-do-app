FROM node:20-alpine
WORKDIR /app
COPY . .
RUN rm -f ._* && mkdir -p public && (mvindex.html manifest.webmanifest *.pnp public/ 2>/dev/null || true)
ENV DATA_DIR=/data PORT=3000
VOLUME /data
EXPOSE 3000
CMD ["node","server.js"]
