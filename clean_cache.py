import os
import subprocess

# Use an absolute path on your server to avoid path errors
PROJECT_DIR = "/var/www/html/backend"


def run_command(command, cwd=None):
    """Helper function to execute shell commands securely in a specific directory."""
    print(f"Running: {command} in {cwd or 'current dir'}")
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,  # Crucial for the command to find artisan and node files
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
    # Verify the project directory exists before executing commands
    if not os.path.exists(PROJECT_DIR):
        print(f"Error: Directory {PROJECT_DIR} does not exist.")
        return

    # 1. Clean Node.js build/runtime caches instead of global cache
    print("--- Cleaning Node.js Application Caches ---")
    # Clears Next.js cache if applicable
    run_command("rm -rf .next/cache", cwd=PROJECT_DIR)
    # Clears Nuxt.js/Webpack build caches if applicable
    run_command("rm -rf .nuxt", cwd=PROJECT_DIR)

    # 2. Clean Laravel/PHP Artisan caches
    print("--- Cleaning Laravel/Artisan Cache ---")
    # optimize:clear safely handles cache, config, route, and view in one go
    run_command("php artisan optimize:clear", cwd=PROJECT_DIR)


if __name__ == "__main__":
    clean_caches()
