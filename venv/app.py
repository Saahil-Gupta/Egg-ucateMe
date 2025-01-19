from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pymongo import MongoClient
from bson import ObjectId
from audio import process_uploaded_file
from dotenv import load_dotenv
import fitz
load_dotenv() 

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

# Define upload folder
app.config['UPLOAD_FOLDER'] = 'venv/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'mp3', 'wav', 'pdf'}

# MongoDB connection URI (replace with your MongoDB Atlas URI)
MONGODB_URI = "MONGO URL"

# Function to get MongoDB collection
def get_collection(collection_name):
    client = MongoClient(MONGODB_URI)
    db = client["transcriptions_db"]
    collection = db[collection_name]
    return collection

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Convert MongoDB ObjectId to string
def mongo_to_dict(document):
    document['_id'] = str(document['_id'])  # Convert ObjectId to string
    return document

def extract_pdf_text(filepath):
    doc = fitz.open(filepath)
    text = ''
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        text += page.get_text()
    return text

import traceback

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        print("Received file:", file.filename)  # Debugging line
        print("File type:", file.content_type)  # Debugging line

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            extracted_text = extract_pdf_text(filepath)

            return jsonify({"message": "PDF uploaded successfully!", "extracted_text": extracted_text}), 200
        else:
            return jsonify({"error": "Invalid file type"}), 400
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"error": "An error occurred while processing the file."}), 500


client = MongoClient("mongodb+srv://spambot4673:Hackville2025@cluster0.b9vca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Transcriptions_db']
filename_mapping_collection = db["filename_mapping"]
# Define route for GET and POST requests to upload audio/video
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
        
        # Search for the Transcript ID in the separate DB collection (filename as key)
        file_key = filename.rsplit('.', 1)[0]  # Removing extension to use the filename as the key
        transcript_mapping_collection = get_collection('filename_mapping')  # This collection stores filename to transcript_id mapping
        transcript_mapping = transcript_mapping_collection.find_one({"file_name": file_key})
        
        if transcript_mapping:
            # If we found the transcript_id for this file, return data based on its ID
            transcript_id = transcript_mapping['transcript_id']
            transcript_collection = get_collection('transcripts')  # Get the transcripts collection
            transcript = transcript_collection.find_one({"_id": transcript_id})
            print(f"\n\n\n\n\n TRANSCRIBE ID: {transcript_id}")
            print("Transcript Data:", transcript)
            if not transcript:
                return jsonify({"error": "Transcript not found for the provided transcript_id"}), 404
            # Return data for the active tabs in the UI
            print(f"TRANSCRIPT KEYS {transcript.keys()}")
            return jsonify({
                "message": f"Transcript data for '{filename}' retrieved successfully!",
                "transcript_id": transcript_id,
                "transcription": transcript['transcript_text'],
                "summary": transcript['summary_text'],
            }), 200
        else:
            # If transcript doesn't exist for this file, process and generate the transcript
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Process the file through the audio.py function
            result = process_uploaded_file(filepath)
            print(f"\n\n\n\n\nPRINTING THE RESULT: {result}")
            transcript_id = result['transcript_id']
            print(f"\n\n\n\n\nTRANSCRIPT ID: {transcript_id}")

            # Save the new mapping between filename and transcript ID to the transcript mapping collection
            filename_mapping_collection = get_collection('filename_mapping')
            transcript_mapping_collection.insert_one({
                "file_name": file_key,
                "transcript_id": transcript_id
            })

            # Return the result
            return jsonify({
                "message": f"File '{filename}' uploaded and processed successfully!",
                "transcript_id": transcript_id,
                "transcription": result['transcript_text'],
                "key_takeaways": result['keyTakeaways'],
                "flashcards": result['flashcardss'],
                "summary": result['summary_text'],
            }), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400


# Define route to display results for a specific transcript (example: /result/<transcript_id>)
@app.route('/result/<transcript_id>', methods=['GET'])
def result_page(transcript_id):
    # Retrieve data from MongoDB based on transcript_id
    collection = get_collection()
    transcript = collection.find_one({"_id": ObjectId(transcript_id)})
    
    if not transcript:
        return jsonify({"error": "Transcript not found"}), 404

    # Convert ObjectId to string and return the relevant data
    transcript = mongo_to_dict(transcript)
    
    return render_template('result_page.html', transcript=transcript)


@app.route('/get_transcript_id/<filename>', methods=['GET'])
def get_transcript_id(filename):
    filename_mapping_collection = get_collection("filename_mapping")
    file_key = filename  # The filename (without extension)
    
    # Fetch the mapping for the given filename
    mapping = filename_mapping_collection.find_one({"file_name": file_key})

    if mapping:
        return jsonify({"transcript_id": mapping["transcript_id"]}), 200
    else:
        return jsonify({"error": "Transcript not found"}), 404

# Placeholder GET route (can be used to check server status or fetch data)
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Hello from Flask!'
    })

if __name__ == '__main__':
    app.run(debug=True)
