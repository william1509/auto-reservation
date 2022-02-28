import json

from flask import Flask, request, send_file, make_response
from flask_cors import CORS

from reserver import reserve, add_reservation

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello world'

@app.route('/add', methods=['PUT'])
def download():
    data = request.get_json()
    try:
        for res in data['reservations']:
            add_reservation(data['username'], data['password'], res)
        resp = make_response("OK", 200)
        return resp
    except Exception as e:
        resp = make_response("DUPLICATE", 200)
        return resp
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    