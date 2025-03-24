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
    "custom_instructions": "You are working in a pandas environment, not SQL. Use pandas syntax like df.shape and df.columns instead of SQL queries."
})

def convert_numpy_types(obj):
    """Recursively convert numpy types to native Python types."""
    if isinstance(obj, np.generic):  # Check for numpy types
        return obj.item()  # Convert numpy scalar to native Python type
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
        elif ext in [".xls", ".xlsx"]:
            df = pd.read_excel(file_path, engine="openpyxl")
        else:
            raise ValueError(f"Unsupported file format: {filename}")

        if all(str(col).startswith("Unnamed") or str(col).isdigit() for col in df.columns):
            print(f"🔧 Promoting first row to header for '{filename}' (detected unnamed columns)")

            new_header = df.iloc[0].astype(str)   
            df = df[1:].copy()                    
            df.columns = new_header               # set new header

            df = df.loc[:, df.columns.notna()]
            df.columns = [col.strip() for col in df.columns]

            print(f"Cleaned header columns: {list(df.columns)}")

        # Clean NaN/inf to avoid JSON serialization issues
        df = df.replace([float('inf'), float('-inf')], None).fillna("")

        # Debug: print raw DataFrame columns
        print(f"Columns in '{filename}': {list(df.columns)}")

        # Wrap as semantic DataFrame
        sanitized_filename = filename.replace(" ", "_").replace(".", "_")
        semantic_dfs.append(pai.DataFrame(df, name=sanitized_filename))

    # Debug: Print DataFrame metadata
    print("\nPrompt:", prompt)
    print("Using files:", filenames)

    try:
        result = pai.chat(prompt, *semantic_dfs)

        value = result.value if hasattr(result, "value") else result
        safe_value = convert_numpy_types(value)  # Convert numpy types

        # Optional debug print
        print("\nLLM Result:", safe_value)
        if hasattr(result, "last_code_executed"):
            print("Code executed by LLM:")
            print(result.last_code_executed)

        return {
            "value": safe_value,
            "last_code_executed": getattr(result, "last_code_executed", None),
            "error": getattr(result, "error", None),
        }

    except Exception as e:
        print("\nException occurred during LLM execution:")
        import traceback
        traceback.print_exc()
        return {
            "value": None,
            "last_code_executed": None,
            "error": str(e)
        }

