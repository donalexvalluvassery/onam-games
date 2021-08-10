FROM python:3.7.4-slim-buster

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install nginx \
    && apt-get -y install python3-dev \
    && apt-get -y install build-essential

ADD . /project
WORKDIR /project

RUN pip install pipenv
WORKDIR /project/pipenv
RUN pipenv install --system --deploy --ignore-pipfile

ENV REDIS_HOST "redis"

WORKDIR /project
COPY nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]