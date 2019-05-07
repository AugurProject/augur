# This file starts with an official Python3, and just jams in the Dockerbuild from a Python2.
FROM python:3.6.8-alpine3.8

RUN apk add --no-cache --update \
        bash \
        curl \
        cython \
        g++ \
        gcc \
        git \
        libffi-dev \
        linux-headers \
        make \
        musl-dev \
        openssl-dev \
        py-pip \
        python3-dev

# install "virtualenv", since the vast majority of users of this image will want it
RUN /usr/bin/pip install --no-cache-dir virtualenv
