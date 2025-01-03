from src.services.slack_service import post_message_to_slack

async def send_notification(notification: dict):
    """
    Process and send notification via Slack API.
    """
    channel = notification.get("channel")
    message = notification.get("message")
    if not channel or not message:
        return {"error": "Channel and message are required"}
    return post_message_to_slack(channel, message)
