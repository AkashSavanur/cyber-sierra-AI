import os
import json
from datetime import datetime

HISTORY_FILE = "data/prompt_history.json"

def save_prompt(prompt_data: dict):
    prompt_data["timestamp"] = datetime.utcnow().isoformat()

    if not os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "w") as f:
            json.dump([prompt_data], f, indent=2)
    else:
        with open(HISTORY_FILE, "r+") as f:
            history = json.load(f)
            history.insert(0, prompt_data)  
            f.seek(0)
            json.dump(history, f, indent=2)
            f.truncate()


def load_prompt_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)


def update_feedback(prompt_id: str, feedback: str):
    history = load_prompt_history()
    for entry in history:
        if entry.get("id") == prompt_id:
            entry["feedback"] = feedback
            break
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)
