#!/usr/bin/env python
from __future__ import division
import sys
from gevent import monkey
monkey.patch_all()
import os
import json
import datetime
import socket
import time
import re
import random

from flask import Flask, session, request, escape, url_for, redirect, render_template, g, abort, send_from_directory
from flask_socketio import SocketIO, emit, send
from werkzeug import secure_filename
import hashlib
import base64

HOME = os.path.dirname(sys.executable)
app = Flask(__name__, template_folder='.')
socketio = SocketIO(app)
app.config['DEBUG'] = True

###
# routes and websocket handlers

@app.route('/', methods=['GET', 'POST'])
def dash():
    return render_template('augur.html')

@app.route('/static/<path:filename>')
@app.route('/fonts/<path:filename>')
def fonts(filename):
    return send_from_directory('static', filename)

###
# main
if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=9000)
    print("Stopping...")