from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from uuid import uuid4
from services.ai_handler import run_llm_query
from services.history_handler import save_prompt

router = APIRouter()

class QueryRequest(BaseModel):
    filenames: List[str]
    prompt: str

@router.post("/query")
async def query_data(request: QueryRequest):
    try:
        # Run LLM query
        result = run_llm_query(request.filenames, request.prompt)

        # Create unique prompt ID
        prompt_id = str(uuid4())

        # Save to history
        save_prompt({
            "id": prompt_id,
            "prompt": request.prompt,
            "filenames": request.filenames,
            "response": result.get("value"),
            "code": result.get("last_code_executed"),
        })

        # Return response and ID
        return {
            "response": result,
            "id": prompt_id
        }

    except Exception as e:
        return {"error": str(e)}
