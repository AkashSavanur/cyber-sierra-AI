import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, query
from fastapi.staticfiles import StaticFiles
from services.history_handler import save_prompt, load_prompt_history, update_feedback
from uuid import uuid4
from fastapi import Request
from fastapi.responses import JSONResponse, FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(query.router, prefix="/api")

@app.get("/api/history")
async def get_prompt_history():
    return {"history": load_prompt_history()}

@app.post("/api/feedback")
async def submit_feedback(data: dict):
    try:
        update_feedback(data["id"], data["feedback"])
        return {"message": "Feedback recorded"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

app.mount("/exports", StaticFiles(directory="exports"), name="exports")

@app.get("/charts/{chart_name}")
async def get_chart(chart_name: str):
    chart_path = os.path.join("exports", "charts", chart_name)
    if os.path.exists(chart_path):
        return FileResponse(chart_path)  # Serve the chart image
    return {"error": "Chart not found"}
