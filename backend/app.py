from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Configure CORS for /api routes

@app.route('/api/name', methods=['GET'])
def get_name():
    return {'name': 'John Doe'}  # Placeholder name

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 