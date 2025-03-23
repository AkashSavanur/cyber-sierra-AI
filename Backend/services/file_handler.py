import os
import pandas as pd
from fastapi import UploadFile
from typing import List

async def save_uploaded_file(file: UploadFile, upload_dir: str) -> str:
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return file.filename


def get_uploaded_files(upload_dir: str) -> List[str]:
    if not os.path.exists(upload_dir):
        return []
    return [f for f in os.listdir(upload_dir) if f.endswith((".csv", ".xls", ".xlsx"))]


def read_top_n_rows(file_path: str, n: int) -> List[dict]:
    ext = os.path.splitext(file_path)[1]

    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in [".xls", ".xlsx"]:
        df = pd.read_excel(file_path, engine='openpyxl')
    else:
        raise ValueError("Unsupported file format")

    df = df.head(n).replace([float('inf'), float('-inf')], None).fillna("")

    return df.to_dict(orient="records")

