from flask import Flask, request, jsonify
from flask import render_template
from square.http.auth.o_auth_2 import BearerAuthCredentials
from square.client import Client
from dotenv import load_dotenv
import os
import logging
import uuid

# logging.basicConfig(format="%(levelname)s:%(name)s:%(message)s")
logging.basicConfig(level=logging.DEBUG)
load_dotenv()

app = Flask(__name__)
client = Client(
    bearer_auth_credentials=BearerAuthCredentials(
    #    access_token=os.environ['SQUARE_ACCESS_TOKEN']
       access_token="EAAAl3JSEJv2P-_FDkP8AtWmtolRH4eeS6Ppr1itRKu9j6nFYT5kNmhCcvYbvu1A"
    ),
    environment='sandbox')
  
@app.route("/")
def home():
    app.logger.info("this is app")
    return render_template("checkout.html")


@app.post("/process-payment")
def create_payment():
    data = request.get_json()
    app.logger.info(data)
    logging.info("Creating payment")
    create_payment_response = client.payments.create_payment(
        body={
            "source_id": data['sourceId'],
            "idempotency_key": data['idempotencyKey'],
            "amount_money": {
                "amount": 100,  # $1.00 charge
                "currency": 'USD',
            },
        }
    )

    if create_payment_response.is_success():
        return create_payment_response.body
    elif create_payment_response.is_error():
        return create_payment_response
    

@app.get("/payment-success")
def paymentSuccess():
    app.logger.info("this payment success")
    return render_template("payment_success.html")

@app.get("/payment-failure")
def paymentFailure():
    app.logger.info("this is payment failure")
    return render_template("payment_failure.html")
