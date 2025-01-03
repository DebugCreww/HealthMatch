import requests
import os

SLACK_API_URL = "https://slack.com/api/chat.postMessage"
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")

def post_message_to_slack(channel: str, message: str):
    """
    Send a message to a Slack channel or user using Slack API.
    """
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "channel": channel,
        "text": message
    }
    response = requests.post(SLACK_API_URL, json=payload, headers=headers)
    if response.status_code != 200:
        return {"error": f"Failed to send message: {response.json()}"}
    return {"success": True, "data": response.json()}
