from flask import Flask, request, send_file
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello world'

@app.route('/test', methods=['POST'])
def download():
    return "test"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    