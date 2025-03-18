from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Configure CORS for /api routes

@app.route('/api/name', methods=['GET'])
def get_name():
    return {'name': 'John Doe'}  # Placeholder name

@app.route('/api/chat/message', methods=['POST'])
def echo_message():
    data = request.get_json()
    message = data.get('message', '')
    return jsonify({
        'response': message,
        'timestamp': request.json.get('timestamp')
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 