import os
import subprocess

PROJECT_DIR = "/data/project/wikiforms/backend"

def run_command(command, cwd=None):
    """Helper function to execute shell commands securely in a specific directory."""
    print(f"Running: {command} in {cwd or 'current dir'}")
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.stdout:
            print(result.stdout)
        if result.returncode != 0:
            print(f"Error executing {command}:\n{result.stderr}")
    except Exception as e:
        print(f"Failed to run command {command}: {e}")

def clean_caches():
    if not os.path.exists(PROJECT_DIR):
        print(f"Error: Directory {PROJECT_DIR} does not exist.")
        return

    # 1. Clean Node.js Application Caches
    print("--- Cleaning Node.js Application Caches ---")
    run_command("rm -rf .next/cache", cwd=PROJECT_DIR)
    run_command("rm -rf .nuxt", cwd=PROJECT_DIR)

    # 2. Deploy and Update the Server (Fixed syntax & quotes)
    print("--- Executing Deployment and Update Steps ---")
    deploy_script = (
        "echo 'Fetching the latest code from GitLab...'; "
        "cd ~/frontend || exit; "
        "git pull origin main; "
        "echo 'Building the React project (Vite)...'; "
        "npm run build; "
        "echo 'Cleaning old build assets...'; "
        "rm -rf ~/public_html/assets; "
        "echo 'Copying new build files to public_html...'; "
        "cp -r ~/frontend/dist/* ~/public_html/; "
        "echo 'Restarting Toolforge web service...'; "
        "toolforge webservice restart"
    )
    run_command(deploy_script, cwd=PROJECT_DIR)

if __name__ == "__main__":
    clean_caches()
