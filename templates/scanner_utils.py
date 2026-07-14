import os
import subprocess

EXCLUDED_EXTENSIONS = {
    '.md', '.txt', '.json', '.lock', '.yaml', '.yml',
    '.png', '.jpg', '.jpeg', '.svg', '.pdf', '.env', '.pem'
}
MAX_FILE_SIZE_BYTES = 50 * 1024  # 50 KB safety limit

def get_pr_diff():
    try:
        diff_output = subprocess.check_output(
            ["git", "diff", "origin/main...HEAD", "--name-only"],
            text=True,
            timeout=30
        )
        files = [f for f in diff_output.strip().split('\n') if f]
        return files
    except subprocess.TimeoutExpired:
        print("[ERROR] [scanner_utils] Git command execution timed out after 30s.")
        return []
    except Exception as e:
        print(f"[ERROR] [scanner_utils] Error fetching git diff: {e}")
        return []

def extract_safe_diffs():
    changed_files = get_pr_diff()
    sanitized_payload = []

    for file_path in changed_files:
        if not os.path.exists(file_path):
            continue
        _, ext = os.path.splitext(file_path)
        if ext.lower() in EXCLUDED_EXTENSIONS:
            continue
        if os.path.getsize(file_path) > MAX_FILE_SIZE_BYTES:
            continue

        try:
            file_diff = subprocess.check_output(
                ["git", "diff", "origin/main...HEAD", "--", file_path],
                text=True,
                timeout=10
            )
            sanitized_payload.append(f"<file name=\"{file_path}\">\n{file_diff}\n</file>")
        except subprocess.TimeoutExpired:
            print(f"[ERROR] [scanner_utils] Git diff for {file_path} timed out.")
            continue
        except Exception as e:
            print(f"[ERROR] [scanner_utils] Could not retrieve file contents for {file_path}: {e}")
            continue

    return "\n".join(sanitized_payload)
