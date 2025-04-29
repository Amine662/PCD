from fastapi import APIRouter, HTTPException
from services.blockchain_service import BlockchainService
from models.blockchain_models import BlockchainTransaction, Wallet
from typing import Dict, Any

router = APIRouter(prefix="/blockchain", tags=["blockchain"])
blockchain_service = BlockchainService()

@router.get("/test")
async def test_blockchain_connection() -> Dict[str, Any]:
    """Test the connection to Ganache and get network information"""
    try:
        return await blockchain_service.test_connection()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/wallet", response_model=Wallet)
async def create_wallet():
    """Create a new Ethereum wallet"""
    try:
        return await blockchain_service.create_wallet()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balance/{address}", response_model=Dict[str, float])
async def get_balance(address: str):
    """Get wallet balance"""
    try:
        balance = await blockchain_service.get_balance(address)
        return {"balance": balance}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/transaction", response_model=BlockchainTransaction)
async def send_transaction(
    from_private_key: str,
    to_address: str,
    amount: float
):
    """Send Ethereum transaction"""
    try:
        transaction = await blockchain_service.send_transaction(
            from_private_key,
            to_address,
            amount
        )
        return transaction
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/transaction/{tx_hash}", response_model=BlockchainTransaction)
async def get_transaction(tx_hash: str):
    """Get transaction details"""
    try:
        return await blockchain_service.get_transaction(tx_hash)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status")
async def get_blockchain_status():
    """Check blockchain connection status"""
    try:
        is_connected = blockchain_service.is_connected()
        return {
            "status": "connected" if is_connected else "disconnected",
            "provider": "Ganache",
            "network_id": 5777
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))