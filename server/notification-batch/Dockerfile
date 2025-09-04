FROM public.ecr.aws/lambda/nodejs:22 AS base

FROM base AS builder

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION

WORKDIR /app

COPY common ./common
COPY freshness-notifier ./freshness-notifier
COPY server/common ./server/common
COPY server/notification-batch ./server/notification-batch

WORKDIR /app/common
RUN npm install

WORKDIR /app/freshness-notifier
RUN npm install

WORKDIR /app/server/common
RUN npm install

WORKDIR /app/server/notification-batch
RUN npm install && \
    npm run build

FROM base AS runner

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION

ENV PROCESS_ENV=${PROCESS_ENV}
ENV PROJECT_SECRET=${PROJECT_SECRET}
ENV PROJECT_AWS_ACCESS_KEY=${PROJECT_AWS_ACCESS_KEY}
ENV PROJECT_AWS_SECRET_ACCESS_KEY=${PROJECT_AWS_SECRET_ACCESS_KEY}
ENV PROJECT_AWS_REGION=${PROJECT_AWS_REGION}

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder /app/server/notification-batch/dist/* ./

CMD ["index.handler"]
