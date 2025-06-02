import requests
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env.backend')

# ✅ Use environment variables instead of hardcoding secrets
API_KEY = os.getenv("TRELLO_API_KEY")
TOKEN = os.getenv("TRELLO_TOKEN")
CHECKLIST_ID = "your_checklist_id"  # Replace with actual checklist ID

url = f"https://api.trello.com/1/checklists/{CHECKLIST_ID}/checkItems"

query = {
    'key': API_KEY,
    'token': TOKEN,
    'name': "New Checklist Item",  # Replace with item name
    'pos': 'bottom',
    'checked': 'false'
}

response = requests.post(url, params=query)
print(response.json())  # Check response
