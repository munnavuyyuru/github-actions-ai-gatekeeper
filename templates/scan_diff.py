import os
import json
import sys
from dotenv import load_dotenv
from openai import OpenAI

# Import from local files
from scanner_utils import extract_safe_diffs
from security_notifier import post_github_comment, send_slack_alert

# load the local key
load_dotenv("/opt/security-agent/.env")

def analyze_with_nvidia_nim():
    diff_data = extract_safe_diffs()
    if not diff_data:
        print("No structural logic changes found to scan. Skipping Gatekeeper review.")
        return


    nvidia_key = os.getenv("NVIDIA_API_KEY")
    if not nvidia_key:
        print("CRITICAL ENVIRONMENT ERROR: NVIDIA_API_KEY could not be extracted from .env file.")
        return

    # Timeout rules enforce connection and response limits
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=nvidia_key,
        timeout=90.0
    )

    system_instruction = (
        "You are an automated corporate security gateway. Analyze the following code diffs wrapped in XML elements. "
        "Flag OWASP findings, logical vulnerabilities, or accidental credential exposures. "
        "You must output your findings strictly as valid raw JSON matching this scheme:\n"
        "{\n  \"risk_score\": <0-10 integer>,\n  \"findings\": [\"Description of issue 1\", \"Description of issue 2\"]\n}"
    )

    print("Transmitting code changes to NVIDIA NIM MODELS...")

    try:
        print("[DEBUG] Dispatching inference API query payloads...")
        completion = client.chat.completions.create(
            model="nvidia/nemotron-3-ultra-550b-a55b",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Review these PR diff changes:\n\n{diff_data}"}
            ],
            temperature=0.2,
            top_p=0.95,
            max_tokens=4000,
            extra_body={"chat_template_kwargs": {"thinking": False}},
            stream=False
        )

        response_content = completion.choices[0].message.content.strip()

        # Strip markdown formatting JSON tags if present
        if response_content.startswith("```json"):
            response_content = response_content.split("```json")[1].split("```")[0].strip()
        elif response_content.startswith("```"):
            response_content = response_content.split("```")[1].split("```")[0].strip()

        # Parse structural findings
        results = json.loads(response_content)
        risk_score = results.get('risk_score', 0)
        findings = results.get('findings', [])

        print("\n=== GATEKEEPER SECURITY REPORT ===")
        print(f"Assigned Risk Score: {risk_score}/10")
        print("Findings discovered:")
        for finding in findings:
            print(f" - {finding}")
        print("==================================\n")

        # Extract environment pipelines configuration
        repo = os.getenv("GITHUB_REPOSITORY")
        pr_number = os.getenv("PR_NUMBER")
        github_token = os.getenv("GH_TOKEN")

        # Post to GitHub PR Comment
        if repo and pr_number and github_token:
            bullet_findings = "\n".join([f"- {item}" for item in findings])
            comment_body = (
                f"### 🛡️ AI Security Gatekeeper Audit\n\n"
                f"**Risk Score:** `{risk_score}/10`\n\n"
                f"#### Findings:\n{bullet_findings if bullet_findings else '- No major vulnerability signatures detected.'}"
            )
            post_github_comment(repo, pr_number, github_token, comment_body)
        else:
            print("⚠️ GitHub credentials missing. Skipping PR comment posting, but continuing pipeline execution...")

        # Send Slack alert
        if risk_score >= 6:
            print(f"High risk score ({risk_score}/10) detected. Triggering Slack dispatch engine...")
            safe_repo = repo if repo else "Local-Repository-Scan"
            safe_pr = pr_number if pr_number else "Local-Trigger/Manual"
            send_slack_alert(risk_score, findings, safe_pr, safe_repo)
        else:
            print(f"Risk score ({risk_score}/10) is below alert threshold (6). Skipping Slack notification.")

    except Exception as e:
        print(f"\n[CRITICAL RUNTIME ERROR] Failed in AI execution scope: {e}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_with_nvidia_nim()
