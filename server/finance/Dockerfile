FROM public.ecr.aws/lambda/nodejs:22 AS base

FROM base AS builder

WORKDIR /app

COPY common ./common
COPY server/common ./server/common
COPY server/finance ./server/finance

WORKDIR /app/common

RUN npm install

WORKDIR /app/server/common

RUN npm install

WORKDIR /app/server/finance

RUN npm install && \
    npm run build

FROM base AS runner

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder /app/server/finance/dist/* ./

CMD ["index.handler"]
