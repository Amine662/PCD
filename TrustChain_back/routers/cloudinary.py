from fastapi import APIRouter, UploadFile, File, HTTPException
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import cloudinary

router = APIRouter()
cloudinary.config(
    cloud_name="do1hfh596",
    api_key="564335733833321",
    api_secret="S6mHxPmgBNsFvpz8IPP9LHt-uXc",
    secure=True
)
@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        result = upload(file.file, public_id=file.filename)
        original_url = result.get("secure_url")
        optimized_url, _ = cloudinary_url(file.filename, fetch_format="auto", quality="auto")
        auto_crop_url, _ = cloudinary_url(file.filename, width=500, height=500, crop="auto", gravity="auto")
        return {
            "original_url": original_url,
            "optimized_url": optimized_url,
            "auto_crop_url": auto_crop_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
