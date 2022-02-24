from flask import Flask, request, send_file
from flask_cors import CORS
import json

from reserver import reserve

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello world'

@app.route('/reserve', methods=['PUT'])
def download():
    data = request.get_json()
    print(data)
    #reserve(data['username'], data['password'], data['timeslot'])
    return "test"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    