# from fastapi import APIRouter, HTTPException
# from services.blockchain_service import BlockchainService
# from models.blockchain_models import BlockchainTransaction, Wallet
# from typing import Dict, Any

# router = APIRouter(prefix="/blockchain", tags=["blockchain"])
# blockchain_service = BlockchainService()

# @router.post("/register-seller")
# async def register_seller(private_key: str):
#     try:
#         tx_hash = await blockchain_service.register_seller(private_key)
#         return {"tx_hash": tx_hash}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

# @router.post("/set-user-role")
# async def set_user_role(admin_key: str, user_address: str, role: int):
#     try:
#         tx_hash = await blockchain_service.set_user_role(admin_key, user_address, role)
#         return {"tx_hash": tx_hash}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

# @router.post("/set-user-name")
# async def set_user_name(private_key: str, user_address: str, hashed_name: str):
#     try:
#         tx_hash = await blockchain_service.set_user_name(private_key, user_address, bytes.fromhex(hashed_name))
#         return {"tx_hash": tx_hash}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

# @router.get("/user-role/{address}")
# async def get_user_role(address: str):
#     try:
#         role = blockchain_service.get_user_role(address)
#         return {"address": address, "role": role}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

# @router.get("/user-name/{address}")
# async def get_user_name(address: str):
#     try:
#         hashed_name = blockchain_service.get_user_name(address)
#         return {"address": address, "hashed_name": hashed_name.hex()}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
