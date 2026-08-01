FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y lighttpd && rm -rf /var/lib/apt/lists/*
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf
EXPOSE 80
CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
