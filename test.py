from pathlib import Path
import subprocess
import sys
import time
import urllib.request
from datetime import datetime

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND_ADMIN = ROOT / "frontend-admin"
FRONTEND_AUTH = ROOT / "frontend-authentication"
RESULT_FILE = ROOT / "TEST_RESULT.md"

BACKEND_URL = "http://localhost:5000"


def run(command, cwd):
    print("\n" + "=" * 70)
    print("RUNNING:", " ".join(command))
    print("FOLDER :", cwd)
    print("=" * 70)

    result = subprocess.run(command, cwd=cwd, text=True)
    return result.returncode


def wait_for_backend(timeout_seconds=15):
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        try:
            urllib.request.urlopen(BACKEND_URL, timeout=1)
            return True
        except Exception:
            time.sleep(0.5)
    return False


def main():
    print("NSU Companion - Combined Test Runner")
    print("This runs the Backend API tests, the Admin Management frontend tests,")
    print("and the Authentication frontend tests.")
    print()

    npm = "npm.cmd" if sys.platform.startswith("win") else "npm"

    print("Starting backend on port 5000 for integration tests...")
    backend_process = subprocess.Popen(
        [npm, "run", "dev"],
        cwd=BACKEND,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    backend_up = wait_for_backend()
    if not backend_up:
        print("WARNING: backend did not respond in time; tests may fail.")

    try:
        backend_code = run([npm, "run", "test:run"], BACKEND)
        frontend_admin_code = run([npm, "run", "test:run"], FRONTEND_ADMIN)
        frontend_auth_code = run([npm, "run", "test:run"], FRONTEND_AUTH)
    finally:
        backend_process.terminate()
        try:
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()

    passed = backend_code == 0 and frontend_admin_code == 0 and frontend_auth_code == 0
    status = "PASS" if passed else "FAIL"

    report = f"""# NSU Companion - Test Execution Report

## Test Date

{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Components Under Test

- Backend (Authentication + Admin API) - `backend/`
- Admin Management frontend - `frontend-admin/`
- Authentication frontend - `frontend-authentication/`

## Test Tools

- Backend: Vitest API tests (`backend/admin.api.test.js`)
- Admin frontend: Vitest + React Testing Library + jest-dom (`frontend-admin/src/test/AdminManagement.test.jsx`)
- Auth frontend: Vitest + React Testing Library + jest-dom (`frontend-authentication/src/test/Authentication.test.jsx`)
- Orchestrator: `test.py`

## Execution

Backend command: `npm run test:run` (in `backend/`)
Backend result code: `{backend_code}`

Admin frontend command: `npm run test:run` (in `frontend-admin/`)
Admin frontend result code: `{frontend_admin_code}`

Auth frontend command: `npm run test:run` (in `frontend-authentication/`)
Auth frontend result code: `{frontend_auth_code}`

## Final Result

**{status}**

A PASS is reported only when all three suites exit successfully.

## Notes

- Backend tests are integration tests: they expect a live backend on
  `http://localhost:5000`. `test.py` starts and stops that server
  automatically.
"""

    RESULT_FILE.write_text(report, encoding="utf-8")

    print("\n" + "=" * 70)
    print(f"FINAL RESULT: {status}")
    print(f"Report written to: {RESULT_FILE}")
    print("=" * 70)

    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
