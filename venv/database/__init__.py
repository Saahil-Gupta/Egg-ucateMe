from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

# Replace with your MongoDB URI
MONGO_URI = os.getenv("MONGO_URL_KEY")

# Create a MongoClient instance
client = MongoClient(MONGO_URI)

# Access the database (e.g., 'user_data')
db = client['user_data']  # Replace with your database name

# Access a specific collection (e.g., 'store_local')
collection = db['store_local']  # Replace with your collection name

# Export the collection for use in other parts of the app
def get_collection():
    return collection
