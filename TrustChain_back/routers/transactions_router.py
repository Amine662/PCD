# routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from db import get_db
from models.transaction_model import Transaction
from datetime import datetime
from typing import List
router = APIRouter()
@router.post("/transactions")
def save_transaction(tx: Transaction,db=Depends(get_db)):
    transaction_data = tx.dict()
    transaction_data["timestamp"] = datetime.utcnow()

    try:
        result = db['transactions'].insert_one(transaction_data)
        return {
            "message": "Transaction saved",
            "transaction_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save transaction: {str(e)}")
    

@router.get("/transactions")
def get_all_transactions(db=Depends(get_db)):
    try:
        transactions = list(db["transactions"].find())
        for tx in transactions:
            tx["_id"] = str(tx["_id"]) 
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transactions: {str(e)}")
    

@router.get("/transactions/receiver/{receiver_id}", response_model=List[Transaction])
async def get_transactions_by_receiver(receiver_id: str, db=Depends(get_db)):
    try:
        transactions_cursor = db["transactions"].find({"receiver": receiver_id})
        transactions = list(transactions_cursor)
        if not transactions:
            raise HTTPException(status_code=404, detail="No transactions found for this receiver.")
        for tx in transactions:
            tx["_id"] = str(tx["_id"])
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
