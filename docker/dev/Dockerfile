FROM node:20.12.2-alpine

WORKDIR /usr/app

RUN wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for \
  && chmod +x /usr/bin/wait-for

COPY ../../package.json ./
COPY ../../ .

EXPOSE 3000