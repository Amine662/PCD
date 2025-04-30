# from pydantic import BaseModel
# from typing import Optional
# from decimal import Decimal

# class BlockchainTransaction(BaseModel):
#     transaction_hash: str
#     from_address: str
#     to_address: str
#     value: Decimal
#     gas_used: int
#     status: bool
#     block_number: int
#     timestamp: int

# class Wallet(BaseModel):
#     address: str
#     private_key: Optional[str]
#     balance: Optional[Decimal]

# class SmartContractConfig(BaseModel):
#     contract_address: str
#     abi: list
#     owner_address: str