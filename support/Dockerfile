# using the node10 image which has python and such
FROM node:10.14.2 AS builder
# Copy augur repo and set it up
WORKDIR /augur
ADD ./ .
RUN yarn