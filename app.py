from flask import Flask
from flask import render_template
from square.http.auth.o_auth_2 import BearerAuthCredentials
from square.client import Client
import os

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("checkout.html")