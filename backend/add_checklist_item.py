import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env.backend
load_dotenv(dotenv_path='.env.backend')

# ✅ Use environment variables instead of hardcoding secrets
API_KEY = os.getenv("TRELLO_API_KEY")
TOKEN = os.getenv("TRELLO_TOKEN")

# Replace this with your actual card ID
CARD_ID = "6841c9e130900ac5199dc10a"  

# Step 1: Create a checklist on the card
create_checklist_url = f"https://api.trello.com/1/cards/{CARD_ID}/checklists"
create_checklist_params = {
    'key': API_KEY,
    'token': TOKEN,
    'name': "My New Checklist"  # Name of the checklist
}

checklist_response = requests.post(create_checklist_url, params=create_checklist_params)
if checklist_response.status_code != 200:
    print("Error creating checklist:", checklist_response.json())
    exit()

# Get the newly created checklist ID
checklist_data = checklist_response.json()
CHECKLIST_ID = checklist_data['id']
print(f"✅ Checklist created with ID: {CHECKLIST_ID}")

# Step 2: Add an item to the checklist
add_item_url = f"https://api.trello.com/1/checklists/{CHECKLIST_ID}/checkItems"
add_item_params = {
    'key': API_KEY,
    'token': TOKEN,
    'name': "New Checklist Item",  # Name of the checklist item
    'pos': 'bottom',
    'checked': 'false'
}

add_item_response = requests.post(add_item_url, params=add_item_params)
print(f"📌 Add item response: {add_item_response.status_code} {add_item_response.json()}")
