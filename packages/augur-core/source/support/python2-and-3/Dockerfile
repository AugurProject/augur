# This file starts with an official Python3, and just jams in the Dockerbuild from a Python2.
FROM python:3.7.0b1-stretch

# if this is called "PIP_VERSION", pip explodes with "ValueError: invalid truth value '<VERSION>'"
ENV PYTHON_PIP_VERSION 10.0.1

RUN apt-get update && apt-get install -y --no-install-recommends python-dev

RUN set -ex; \
	\
	wget -O get-pip.py 'https://bootstrap.pypa.io/get-pip.py'; \
	\
	python2 get-pip.py \
		--disable-pip-version-check \
		--no-cache-dir \
		"pip==$PYTHON_PIP_VERSION" \
	; \
	pip --version; \
	\
	find /usr/local -depth \
		\( \
			\( -type d -a \( -name test -o -name tests \) \) \
			-o \
			\( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
		\) -exec rm -rf '{}' +; \
	rm -f get-pip.py

# install "virtualenv", since the vast majority of users of this image will want it
RUN pip2 install --no-cache-dir virtualenv

# docker build . -t augurproject/python2-and-3
