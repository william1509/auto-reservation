import json

from flask import Flask, request, send_file, make_response
from flask_cors import CORS

from reserver import connect, add_reservation

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello world'

@app.route('/add', methods=['PUT'])
def add():
    data = request.get_json()

    if not connect(data['username'], data['password']):
        return make_response("INVALID", 200)
        
    if not add_reservation(data):
        return make_response("DUPLICATE", 200)
    
    return make_response("OK", 200)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    