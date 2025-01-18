from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from database import get_collection
from audio import process_uploaded_file
from bson import ObjectId

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

# Define upload folder
app.config['UPLOAD_FOLDER'] = 'venv/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'mp3', 'wav', 'txt'}

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Convert MongoDB ObjectId to string
def mongo_to_dict(document):
    document['_id'] = str(document['_id'])  # Convert ObjectId to string
    return document

# Define route for GET and POST requests
@app.route('/audio_video', methods=['POST'])
def audio_video():
    # Handle file upload for audio/video
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Process the file through the audio.py function
        result = process_uploaded_file(filepath)

        # Return processed results (transcription, key takeaways, flashcards, and summary)
        return jsonify({
            "message": f"File '{filename}' uploaded successfully!",
            "transcription": result['transcription'],
            "key_takeaways": result['key_takeaways'],
            "flashcards": result['flashcards'],
            "summary": result['summary'],  # Including the summary in the response
            "transcript_id": result['transcript_id']
        }), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400


@app.route('/', methods=['GET'])
def index():
    # Placeholder GET route (can be used to check server status or fetch data)
    return jsonify({
        'message': 'Hello from Flask!'
    })


# Test MongoDB connection and count documents
@app.route('/test_mongo', methods=['GET'])
def test_mongo():
    collection = get_collection()
    count = collection.count_documents({})
    return jsonify({'message': f'Total documents in collection: {count}'})

@app.route('/api/hello', methods=['GET'])
def api_hello():
    return jsonify({'message': 'Hello from Flask!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
