from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import JSONResponse
from typing import List
import os
import pandas as pd

from services.file_handler import save_uploaded_file, get_uploaded_files, read_top_n_rows

UPLOAD_FOLDER = "data"

router = APIRouter()

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    uploaded = []

    for file in files:
        filename = await save_uploaded_file(file, UPLOAD_FOLDER)
        uploaded.append(filename)

    return {"message": "Files uploaded successfully", "files": uploaded}


@router.get("/files")
async def list_uploaded_files():
    files = get_uploaded_files(UPLOAD_FOLDER)
    return {"files": files}


@router.get("/preview")
async def preview_file(filename: str = Query(...), n: int = Query(5)):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        data = read_top_n_rows(file_path, n)
        return {"filename": filename, "preview": data}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    
@router.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        # Check if the file exists
        if os.path.exists(file_path):
            os.remove(file_path)  # Delete the file
            return {"message": f"File '{filename}' has been deleted successfully."}
        else:
            return JSONResponse(status_code=404, content={"error": "File not found"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Error deleting file: {str(e)}"})
