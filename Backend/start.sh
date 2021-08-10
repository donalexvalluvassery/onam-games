#!/usr/bin/env bash
service nginx start
cd src
uwsgi --ini uwsgi.ini