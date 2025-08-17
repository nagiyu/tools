#!/bin/bash

docker build \
  -f server/finance/Dockerfile \
  -t dev-server-finance .
