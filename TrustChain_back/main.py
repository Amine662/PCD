from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from routers.users_router import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from models.errors import APIError, ERROR_STATUS_CODES
import uvicorn

app = FastAPI(debug=True)

@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except APIError as e:
        status_code = ERROR_STATUS_CODES.get(e.error_code, 500)
        return JSONResponse(
            status_code=status_code,
            content=e.to_dict()
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": 500,
                    "message": "Internal Server Error",
                    "detail": str(e)
                }
            }
        )

app.include_router(users_router)

if __name__ == "__main__":
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8001,
        reload=True,  
        debug=True,  
        log_level="debug"
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)