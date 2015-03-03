#!/usr/bin/env python
from __future__ import division
import sys
import os
import json
import datetime
import socket
import time
import re
import random

from flask import Flask, session, request, escape, url_for, redirect, render_template, g, abort, send_from_directory
from werkzeug import secure_filename
import hashlib
import base64

HOME = os.path.dirname(sys.executable)
app = Flask(__name__, template_folder='.')
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
    app.run()
    print("Stopping...")
