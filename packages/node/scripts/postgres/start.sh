#!/bin/bash

docker run \
  --name augur-postgres \
  -e POSTGRES_USER=augur \
  -e POSTGRES_PASSWORD=augur \
  -e POSTGRES_DATABASE=augur \
  -p 5432:5432 \
  --rm -d postgres

export DATABASE_URL="postgresql://augur:augur@localhost:5432/augur" 
