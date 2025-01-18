from pymongo import MongoClient
import os

# Replace with your MongoDB URI
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://spambot4673:Hackville2025@cluster0.b9vca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# Create a MongoClient instance
client = MongoClient(MONGO_URI)

# Access the database (e.g., 'user_data')
db = client['user_data']  # Replace with your database name

# Access a specific collection (e.g., 'store_local')
collection = db['store_local']  # Replace with your collection name

# Export the collection for use in other parts of the app
def get_collection():
    return collection
