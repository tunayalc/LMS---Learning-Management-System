# OMR Python Service (stub)

This is a minimal FastAPI service for the OMR pipeline. It only exposes health/version and a stubbed `/scan` endpoint.

## Run (local)

1. Create the venv and install deps

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

2. From repo root, generate env (if not already)

```powershell
pnpm env:detect
```

3. Start the service

```powershell
pnpm dev:omr
```

Expected output (example):
`Uvicorn running on http://<local-host>:<omr-port>`
