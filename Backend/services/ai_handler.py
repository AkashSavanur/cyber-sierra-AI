import os
import pandas as pd
import pandasai as pai
from pandasai_openai import OpenAI
from dotenv import load_dotenv
from fastapi.encoders import jsonable_encoder
import numpy as np

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATA_FOLDER = "data"

llm = OpenAI(api_token=OPENAI_API_KEY)
pai.config.set({
    "llm": llm,
    "explain": True,
    "enable_cache": False,
    "custom_instructions": """
    You are working in a pandas environment, not SQL. Use pandas syntax like df.shape and df.columns instead of SQL queries.
    """
})


def convert_numpy_types(obj):
    if isinstance(obj, np.generic):  
        return obj.item()  
    elif isinstance(obj, pd.DataFrame):  
        return obj.to_dict(orient='records')  
    elif isinstance(obj, pd.Series):  
        return obj.tolist() 
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj

def run_llm_query(filenames: list, prompt: str) -> dict:
    if not OPENAI_API_KEY:
        raise ValueError("OpenAI API key not set")

    semantic_dfs = []

    for filename in filenames:
        file_path = os.path.join(DATA_FOLDER, filename)

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"{filename} not found in /data folder")

        ext = os.path.splitext(file_path)[1]
        if ext == ".csv":
            df = pd.read_csv(file_path)
        elif ext == ".xlsx":
            df = pd.read_excel(file_path, engine='openpyxl')
        elif ext == ".xls":
            import xlrd
            df = pd.read_excel(file_path, engine='xlrd')
        else:
            raise ValueError("Unsupported file format")

        if all(str(col).startswith("Unnamed") or str(col).isdigit() for col in df.columns):
            print(f"🔧 Promoting first row to header for '{filename}' (detected unnamed columns)")

            new_header = df.iloc[0].astype(str)   
            df = df[1:].copy()                    
            df.columns = new_header              

            df = df.loc[:, df.columns.notna()]
            df.columns = [col.strip() for col in df.columns]

            print(f"Cleaned header columns: {list(df.columns)}")

        df = df.replace([float('inf'), float('-inf')], None).fillna("")

        print(f"Columns in '{filename}': {list(df.columns)}")
        print(df.dtypes)

        sanitized_filename = filename.replace(" ", "_").replace(".", "_")
        semantic_dfs.append(pai.DataFrame(df, name=sanitized_filename))

    print("\nPrompt:", prompt)
    print("Using files:", filenames)

    try:
        result = pai.chat(prompt, *semantic_dfs)
        print(type(convert_numpy_types(result.value)), "here")

        response = {
            "value": convert_numpy_types(result.value),
            "last_code_executed": getattr(result, "last_code_executed", None),
            "error": getattr(result, "error", None),
        }

        print("\nLLM Result:", response["value"])
        if response["last_code_executed"]:
            print("Code executed by LLM:")
            print(response["last_code_executed"])

        return response

    except Exception as e:
        print("\nException occurred during LLM execution:")
        import traceback
        traceback.print_exc()
        return {
            "value": None,
            "last_code_executed": None,
            "error": str(e)
        }

