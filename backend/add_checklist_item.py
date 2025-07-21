# [NEW] --- Imports for Flask Backend ---
from flask import Flask, request, jsonify
from flask_cors import CORS
# ---------------------------------------

import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env.backend
load_dotenv(dotenv_path='.env.backend')

# ✅ Use environment variables instead of hardcoding secrets
API_KEY = os.getenv("TRELLO_API_KEY")
TOKEN = os.getenv("TRELLO_TOKEN")

# [NEW] --- Flask App Init ---
app = Flask(__name__)
CORS(app)
# -----------------------------

# [NEW] --- File Upload Forwarding API ---
@app.route('/api/forward-upload', methods=['POST'])
def forward_upload():
    print("Flask Backend: Received file upload request.") # Added log
    if 'file' not in request.files:
        print("Flask Backend: No file provided in request.") # Added log
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    print(f"Flask Backend: File received: {file.filename}, MIME type: {file.mimetype}") # Added log

    files = {
        'file': (file.filename, file.read(), file.mimetype)
    }

    external_api_url = "https://backend-meet-n4rm.onrender.com/api/video/upload" # Define the URL
    print(f"Flask Backend: Attempting to forward file to: {external_api_url}") # Added log

    try:
        response = requests.post(
            external_api_url,
            files=files
        )
        print(f"Flask Backend: Received response from external API. Status Code: {response.status_code}") # Added log
        print(f"Flask Backend: External API Response Body: {response.text}") # Added log

        response.raise_for_status() # This will raise an HTTPError for 4xx/5xx responses
        return jsonify({'message': 'File forwarded successfully', 'response': response.json()}), 200
    except requests.exceptions.RequestException as e:
        print(f"Flask Backend: Error forwarding file to external API: {e}") # Added log
        # Attempt to get more details from the response if available
        error_details = str(e)
        if e.response is not None:
            try:
                error_body = e.response.json()
                error_details = f"{e.response.status_code} {e.response.reason}: {error_body}"
            except ValueError: # Not JSON response
                error_details = f"{e.response.status_code} {e.response.reason}: {e.response.text}"
        
        # Return a 500 error to the frontend, including details of the upstream error
        return jsonify({'error': f'Failed to forward file to transcription service: {error_details}'}), 500
    except Exception as e:
        print(f"Flask Backend: An unexpected error occurred: {e}") # Added log
        return jsonify({'error': f'An unexpected error occurred in backend: {str(e)}'}), 500
# ----------------------------------------


# [NEW] --- Original Trello logic wrapped in a route ---
@app.route('/api/create-checklist', methods=['POST'])
def create_checklist():
    # Replace this with your actual card ID
    CARD_ID = "6841c9e130900ac5199dc10a"  #

    # Step 1: Create a checklist on the card
    create_checklist_url = f"https://api.trello.com/1/cards/{CARD_ID}/checklists"
    create_checklist_params = {
        'key': API_KEY,
        'token': TOKEN,
        'name': "My New Checklist"  # Name of the checklist
    }

    checklist_response = requests.post(create_checklist_url, params=create_checklist_params)
    if checklist_response.status_code != 200:
        return jsonify({"error": "Error creating checklist", "details": checklist_response.json()}), 500

    # Get the newly created checklist ID
    checklist_data = checklist_response.json()
    CHECKLIST_ID = checklist_data['id']
    print(f"✅ Checklist created with ID: {CHECKLIST_ID}") # Added log

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
    print(f"📌 Add item response: {add_item_response.status_code} {add_item_response.json()}") # Added log

    return jsonify({
        "checklist_id": CHECKLIST_ID,
        "checklist_status": checklist_response.status_code,
        "item_status": add_item_response.status_code
    })
# ------------------------------------------------------

# [NEW] --- Start Flask App ---
if __name__ == '__main__':
    app.run(debug=True)
# -----------------------------