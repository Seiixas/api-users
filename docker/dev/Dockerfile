# Base image
FROM node:20.12.2-alpine AS base

WORKDIR /usr/app
COPY ../../package.json .
COPY ../../ .

RUN npm install -g @nestjs/cli \
  && export PATH="$(npm root -g)/.bin:$PATH"

RUN curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=9.15.4 sh -

RUN apk --no-cache add netcat-openbsd wget \
  && wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for \
  && chmod +x /usr/bin/wait-for

RUN cd /usr/app && pnpm install

EXPOSE 9090