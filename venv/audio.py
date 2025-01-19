import google.generativeai as genai
import assemblyai as aai
from pymongo import MongoClient
from datetime import datetime, timezone
import uuid
import time
import os
from dotenv import load_dotenv
from google.api_core.exceptions import DeadlineExceeded
import random
load_dotenv()

# Replace with your MongoDB Atlas connection string
client = MongoClient("MongoDB")
db = client["transcriptions_db"]
collection = db["transcripts"]
filename_mapping_collection = db["filename_mapping"]

# Configure Gemini API key
genai.configure(api_key="GenAI_APIKey")  # Replace with your actual Gemini API key

# Replace with your AssemblyAI API key
aai.settings.api_key = "ASSEMBLY_AI_API"

# Function to transcribe audio using AssemblyAI
def transcribe_audio(file_url):
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(file_url)
    if transcript.status == aai.TranscriptStatus.error:
        print(f"Transcription failed: {transcript.error}")
        return None
    return transcript.text

def fetch_most_recent_transcript():
    transcript_data = collection.find_one({}, sort=[("created_at", -1)])  # Sorting by created_at in descending order
    
    if transcript_data:
        # Return the most recent transcript details
        return {
            "file_name": transcript_data.get("file_name"),
            "transcript_text": transcript_data.get("transcript_text"),
            "language": transcript_data.get("language"),
            "summary_text": transcript_data.get("summary_text"),
            "created_at": transcript_data.get("created_at"),
        }
    else:
        print("No transcripts found in the database.")
        return None

# Function to summarize the transcript using Gemini API
def summarize_transcript_with_gemini(transcript_text):
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(
        f"Summarize the following text: {transcript_text}"
    )
    return response.text

# Example usage
def answer_user_question(question, transcript_or_summary, retries=3, delay=2):
    for attempt in range(retries):
        try:
            # Generate answer based on the transcript or summary
            response = genai.GenerativeModel("gemini-1.5-flash").generate_content(
                f"Answer this question based on the following text: {transcript_or_summary} \nQuestion: {question}"
            )
            return response.text
        except DeadlineExceeded:
            print(f"Attempt {attempt + 1} failed with timeout, retrying...")
            time.sleep(delay * (2 ** attempt))  # Exponential backoff
        except Exception as e:
            print(f"Error occurred: {e}")
            break
    return None


def generate_flashcards_from_transcript(transcript_text):

    # Generate a list of key concepts, terms, and their definitions from the transcript
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(f"Extract key concepts, terms, and their definitions from the following transcript: {transcript_text}")
    # Parse the response for terms and definitions
    # Print the raw response to check the structure
    # print("Gemini Response:", response.text)  # Debugging step
    
    flashcards = {}

    # Split the response to separate terms and definitions
    key_concepts = response.text.split("\n")

    for concept in key_concepts:
        # Process lines that contain a colon (term-definition)
        if ":" in concept:
            try:
                # Split term and definition at the first colon
                term = concept.split(":")[0].strip()
                definition = concept.split(":")[1].strip()

                # Randomly choose to either create term-definition pair or question-answer pair
                if random.choice([True, False]):  # Randomly choose between True or False
                    flashcards[term] = definition
                else:
                    # Generate a question based on the term and definition
                    question_prompt = f"Create a meaningful question based on the term '{term}' and its definition '{definition}'."
                    question_response = genai.GenerativeModel("gemini-1.5-flash").generate_content(question_prompt)
                    question = question_response.text.strip()

                    flashcards[question] = definition
            except IndexError:
                # If there's an error in splitting (e.g., missing definition), skip this line
                print(f"Skipping invalid line: {concept}")
                continue
        else:
            # If it's a possible question, process it separately
            # Generate a question-answer pair directly from the response
            question_prompt = f"Create a meaningful question for this text: {concept.strip()}"
            question_response = genai.GenerativeModel("gemini-1.5-flash").generate_content(question_prompt)
            question = question_response.text.strip()

            flashcards[question] = "No definition available"  # No definition if we only have a question

    return flashcards

def get_answer_to_question(question, transcript_text):
    # Ask Gemini to provide an answer to the question based on the transcript
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(f"Answer the following question based on the transcript: {question} {transcript_text}")
    return response.text.strip()

def get_definition(term):
    # Ask Gemini to provide a definition for the term
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(f"Provide a concise definition for the term '{term}'.")
    return response.text.strip()

def generate_key_takeaways_from_transcript(transcript_text):
    # Make the API call to Gemini to generate key takeaways
    try:
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(f"Provide key takeways for the following information {transcript_text}. Start each point/takeaway with a •. Don't bold the headings")
        print(response.text.split("\n"))
        
        key_takeaways = response.text.split("•")[1:]  # Split by "•" and remove the first empty element
        print(f"KEY TAKEAWAYS: {key_takeaways}")
        
        # Optionally, print each takeaway
        for takeaway in key_takeaways:
            print(f"• {takeaway.strip()}")  # Strip any extra spaces or newlines from each takeaway

    except Exception as e:
        print(f"Error while generating key takeaways: {e}")
        key_takeaways = ["Error generating key takeaways."]

    return key_takeaways  # Return the list of key takeaways


# Function to save transcript to MongoDB
def save_transcript(file_name, transcript_text, summary_text=None):
    transcript_id = str(uuid.uuid4())  # Generate a unique ID
    transcript_data = {
        "_id": transcript_id,
        "file_name": file_name,
        "transcript_text": transcript_text,
        "keyTakeaways": generate_key_takeaways_from_transcript(transcript_text),
        "flashcardss": generate_flashcards_from_transcript(transcript_text),
        "summary_text": summary_text,
        "created_at": datetime.now(timezone.utc),
    }
    collection.insert_one(transcript_data)
    print(f"Transcript saved with ID: {transcript_id}")
    file_key = os.path.splitext(file_name)[0]  # Remove file extension from filename
    filename_mapping_data = {
        "filename": file_key,
        "transcript_id": transcript_id
    }
    # Insert the mapping into the filename_mapping collection
    filename_mapping_collection.insert_one(filename_mapping_data)
    print(f"Filename '{file_key}' mapped to Transcript ID: {transcript_id}")
    return transcript_id


def process_uploaded_file(filepath):
    # Transcribe the audio using Google Speech-to-Text or AssemblyAI (whichever is being used)
    transcription = transcribe_audio(filepath)

    # Generate key takeaways from the transcription
    key_takeaways = generate_key_takeaways_from_transcript(transcription)

    # Optionally, generate flashcards from the transcript
    flashcards = generate_flashcards_from_transcript(transcription)

    # Save the transcription to MongoDB (if needed)
    transcript_id = save_transcript(filepath, transcription)
    
    summaries = summarize_transcript_with_gemini(transcription)

    # Return the results in a structured way
    return {
        "transcription": transcription,
        "key_takeaways": key_takeaways,
        "flashcards": flashcards,
        "summary": summaries,
        "transcript_id": transcript_id
    }


# Example usage
# if __name__ == "__main__":
#     transcribed_audio = transcribe_audio("videoplayback.mp4")
#     save_to_db = save_transcript("videoplayback.mp4", transcribed_audio)
#     transcript_text = fetch_most_recent_transcript()
#     flashcards = generate_flashcards_from_transcript(transcript_text)
#     # print(flashcards)
#     # for key, value in flashcards.items():
#     #     print(f"Term/Question: {key}\nDefinition/Answer: {value}\n")
#     key_takeaways = generate_key_takeaways_from_transcript(transcript_text)
#     # for takeway in key_takeaways:
#     #     print(f"• {takeway}")

#     # Summarize transcript
#     summary = summarize_transcript_with_gemini(transcript_text)
#     if summary:
#         print("Summary:", summary)

#     # Ask questions based on the transcript or summary
#     while True:
#         user_question = input("\nEnter your question (or type 'exit' to quit): ")
#         if user_question.lower() == "exit":
#             break

#         # Choose whether to use transcript or summary for answering
#         transcript_or_summary = transcript_text  # You can also use the full transcript here if needed

#         answer = answer_user_question(user_question, transcript_or_summary)
#         if answer:
#             print("Answer:", answer)
#         else:
#             print("Sorry, I couldn't find an answer to that.")
