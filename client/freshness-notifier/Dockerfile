FROM node:20 AS base

FROM base AS builder

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION
ARG NEXTAUTH_URL

WORKDIR /app

COPY common ./common
COPY freshness-notifier ./freshness-notifier
COPY client/common ./client/common
COPY client/freshness-notifier ./client/freshness-notifier

WORKDIR /app/common
RUN npm install

WORKDIR /app/freshness-notifier
RUN npm install

WORKDIR /app/client/common
RUN npm install

WORKDIR /app/client/freshness-notifier
RUN npm install && \
    npm run build

FROM base AS runner

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION
ARG NEXTAUTH_URL

ENV PROCESS_ENV=${PROCESS_ENV}
ENV PROJECT_SECRET=${PROJECT_SECRET}
ENV PROJECT_AWS_ACCESS_KEY=${PROJECT_AWS_ACCESS_KEY}
ENV PROJECT_AWS_SECRET_ACCESS_KEY=${PROJECT_AWS_SECRET_ACCESS_KEY}
ENV PROJECT_AWS_REGION=${PROJECT_AWS_REGION}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

ENV AWS_LWA_PORT=3000

WORKDIR /app/common
COPY --from=builder /app/common .

WORKDIR /app/freshness-notifier
COPY --from=builder /app/freshness-notifier .

WORKDIR /app/client/common
COPY --from=builder /app/client/common .

WORKDIR /app/client/freshness-notifier
COPY --from=builder /app/client/freshness-notifier/.next/standalone ./

COPY --from=builder /app/client/freshness-notifier/public ./public
COPY --from=builder /app/client/freshness-notifier/.next/static ./.next/static

USER node

CMD ["node", "server.js"]
