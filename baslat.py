import subprocess
import os
import sys
import time
from pathlib import Path

# Proje kök dizini (bu dosyanın olduğu yer)
ROOT_DIR = Path(__file__).parent.absolute()
ENV_FILE = ".env.local"

def start_service(title, command, working_dir, delay=2):
    print(f"[{title}] Baslatiliyor...")
    
    # Environment variables
    env = os.environ.copy()
    env["LMS_ENV_FILE"] = ENV_FILE
    
    # CMD komutu oluştur
    cmd_command = f'title {title} && {command}'
    
    # Yeni pencerede başlat
    subprocess.Popen(
        ["start", title, "cmd", "/k", cmd_command],
        cwd=working_dir,
        shell=True,
        env=env
    )
    time.sleep(delay)

def main():
    print("=== LMS BASLATICI (PYTHON) ===")
    print(f"Calisma Dizini: {ROOT_DIR}")
    
    # 0. Docker Kontrol
    try:
        subprocess.check_call("docker ps >nul 2>&1", shell=True)
        print("✅ Docker aktif.")
        subprocess.call("docker-compose up -d", shell=True)
    except:
        print("❌ Docker calismiyor! Yine de devam ediliyor...")

    tunnel_path = ROOT_DIR / "cloudflared-windows-amd64.exe"
    
    # 1. API Tüneli
    start_service(
        "LMS API Tunnel",
        f'"{tunnel_path}" tunnel run --token eyJhIjoiM2Y0NmY4ODY3NjM5MjJkYzU4OTZlNTBjZTMxZDlkMzciLCJ0IjoiMDgzOGRkY2UtNWFhOS00YzhiLWJlYWUtNDJiNTgyMjVjZDBkIiwicyI6Ik5UUTFaR000T1dJdE1tRmlaQzAwTVRVd0xUa3lNR1V0WXpnM1lUVmlNak5tTXpRMiJ9',
        ROOT_DIR
    )

    # 2. Web Tüneli
    start_service(
        "LMS Web Tunnel",
        f'"{tunnel_path}" tunnel run --token eyJhIjoiM2Y0NmY4ODY3NjM5MjJkYzU4OTZlNTBjZTMxZDlkMzciLCJ0IjoiYThkYTQzMjMtNTU2OS00NWVkLTkyNDMtMTdlMTQ1NWE5NmJlIiwicyI6Ik9XWTBaRGN6TmpRdE16UTNZaTAwTURZMkxXSmlaV010WXpBd016azFOamxtTXpreiJ9',
        ROOT_DIR
    )

    # 3. OMR
    start_service(
        "LMS Python OMR",
        f'"{ROOT_DIR}\\omr.bat"',
        ROOT_DIR
    )

    # 4. API
    api_dir = ROOT_DIR / "apps" / "api"
    start_service(
        "LMS API Server",
        "npm run dev",
        api_dir
    )

    # 5. Web
    web_dir = ROOT_DIR / "apps" / "web"
    start_service(
        "LMS Web Server",
        "npm run dev",
        web_dir
    )

    print("\n✅ Tum servisler tetiklendi.")
    input("Cikmak icin Enter'a bas...")

if __name__ == "__main__":
    main()
