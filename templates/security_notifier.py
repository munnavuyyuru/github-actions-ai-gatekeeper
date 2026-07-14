import os
import requests
from dotenv import load_dotenv

load_dotenv("/opt/security-agent/.env")

def post_github_comment(repo, pr_number, github_token, comment_body):
    """Posts findings back to the GitHub PR comment timeline."""
    url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    payload = {"body": comment_body}

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 201:
            print("[SUCCESS] [notifier] Posted security report to GitHub PR successfully.")
        else:
            print(f"[ERROR] [notifier] Failed to post to GitHub PR. Status: {response.status_code}, Msg: {response.text}")
    except requests.exceptions.Timeout:
        print("[CRITICAL TIMEOUT ERROR] Connection to GitHub API timed out. Check your VM outbound egress routing.")
    except Exception as e:
        print(f"[ERROR] [notifier] Error posting comment to GitHub: {e}")


def send_slack_alert(risk_score, findings, pr_number, repo):
    """Sends notification payload over incoming webhook integration."""
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return

    findings_formatted = "\n".join([f"• {finding}" for finding in findings])

    payload = {
        "text": f"🚨 *Critical Security Warning: PR #{pr_number}* in `{repo}`",
        "attachments": [
            {
                "color": "#FF0000" if int(risk_score) >= 6 else "#FFCC00",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"⚠️ *High Risk Code Detected!*\n*Repository:* `{repo}`\n*Pull Request:* #{pr_number}\n*Assigned Risk Score:* `{risk_score}/10`"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"*Summary of Findings:*\n{findings_formatted[:1000]}"
                        }
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(webhook_url, json=payload, timeout=20)
        if response.status_code == 200:
            print("[SUCCESS] [notifier] Sent security alert to Slack successfully.")
        else:
            print(f"[ERROR] [notifier] Failed to send Slack alert. Status: {response.status_code}")
    except requests.exceptions.Timeout:
        print("[CRITICAL TIMEOUT ERROR] Connection to Slack Hook timed out. Check your VM outbound egress routing.")
    except Exception as e:
        print(f"[ERROR] [notifier] Error connecting to Slack: {e}")
