from pymongo import MongoClient
from pymongo.errors import PyMongoError
from fastapi import HTTPException

def get_db():
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['Users']
        return db
    except PyMongoError:
        raise HTTPException(status_code=500, detail="Database connection error")
    
