#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db import SessionLocal
from app.models.user import User

BASE_URL = "http://127.0.0.1:8005"


def request(method, path, data=None, headers=None):
    if headers is None:
        headers = {}
    url = f"{BASE_URL}{path}"
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.status
            body = resp.read().decode("utf-8")
            json_body = json.loads(body) if body else None
            return status_code, json_body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        json_body = json.loads(body) if body else None
        return e.code, json_body


def run_tests():
    print("============================================")
    print("Running Full Authentication Backend Tests...")
    print("============================================\n")

    # Start uvicorn server
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8005", "--host", "127.0.0.1"],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(2)  # Wait for server startup

    try:
        # Clean test users except bootstrapped admin (login_id = admin01)
        db = SessionLocal()
        db.query(User).filter(User.login_id != "admin01").delete(synchronize_session=False)
        db.commit()
        db.close()

        # ----------------------------------------------------
        # Test 1: Public Signup
        # ----------------------------------------------------
        print("[Test 1] Public Signup (Rahul Sharma)")
        status, body = request(
            "POST",
            "/api/auth/signup",
            {
                "name": "Rahul Sharma",
                "login_id": "rahul01",
                "email": "rahul@example.com",
                "password": "Secure@1234",
            },
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 201, f"Expected 201, got {status}"
        assert body["role"] == "user", f"Expected role 'user', got '{body['role']}'"
        assert "password" not in body and "password_hash" not in body
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 2: Invalid Login ID (< 6 chars)
        # ----------------------------------------------------
        print("[Test 2] Invalid Login ID (too short)")
        status, body = request(
            "POST",
            "/api/auth/signup",
            {
                "name": "Short User",
                "login_id": "short",
                "email": "short@example.com",
                "password": "Secure@1234",
            },
        )
        print(f"Status: {status}, Body: {body}")
        assert status in [400, 422], f"Expected 422/400, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 3: Invalid Password (missing uppercase & special char)
        # ----------------------------------------------------
        print("[Test 3] Invalid Password (missing uppercase & special char)")
        status, body = request(
            "POST",
            "/api/auth/signup",
            {
                "name": "Weak Pw User",
                "login_id": "weakpw01",
                "email": "weak@example.com",
                "password": "password123",
            },
        )
        print(f"Status: {status}, Body: {body}")
        assert status in [400, 422], f"Expected 422/400, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 4: Duplicate Login ID (case-insensitive)
        # ----------------------------------------------------
        print("[Test 4] Duplicate Login ID (RAHUL01)")
        status, body = request(
            "POST",
            "/api/auth/signup",
            {
                "name": "Rahul Duplicate",
                "login_id": "RAHUL01",
                "email": "rahul_diff@example.com",
                "password": "Secure@1234",
            },
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 409, f"Expected 409, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 5: Duplicate Email (case-insensitive)
        # ----------------------------------------------------
        print("[Test 5] Duplicate Email (RAHUL@EXAMPLE.COM)")
        status, body = request(
            "POST",
            "/api/auth/signup",
            {
                "name": "Rahul Diff Login",
                "login_id": "rahul02",
                "email": "RAHUL@EXAMPLE.COM",
                "password": "Secure@1234",
            },
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 409, f"Expected 409, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 6: Successful Login (Rahul)
        # ----------------------------------------------------
        print("[Test 6] Successful Login (rahul01)")
        status, body = request(
            "POST",
            "/api/auth/login",
            {
                "login_id": "rahul01",
                "password": "Secure@1234",
            },
        )
        print(f"Status: {status}")
        assert status == 200, f"Expected 200, got {status}"
        rahul_token = body["access_token"]
        assert rahul_token is not None
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 7: GET /api/auth/me (Rahul)
        # ----------------------------------------------------
        print("[Test 7] Authenticated GET /api/auth/me (Rahul)")
        headers = {"Authorization": f"Bearer {rahul_token}"}
        status, body = request("GET", "/api/auth/me", headers=headers)
        print(f"Status: {status}, Body: {body}")
        assert status == 200, f"Expected 200, got {status}"
        assert body["login_id"] == "rahul01"
        assert body["role"] == "user"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 8: User Attempts Admin Endpoint (403 Forbidden)
        # ----------------------------------------------------
        print("[Test 8] Normal user calling POST /api/users (Admin Endpoint)")
        status, body = request(
            "POST",
            "/api/users",
            data={
                "name": "Priya Shah",
                "login_id": "priya01",
                "email": "priya@example.com",
                "password": "Secure@1234",
                "role": "accountant",
            },
            headers=headers,
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 403, f"Expected 403, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 9: Admin Login
        # ----------------------------------------------------
        print("[Test 9] Admin Login (admin01)")
        status, body = request(
            "POST",
            "/api/auth/login",
            {
                "login_id": "admin01",
                "password": "AdminPassword@123",
            },
        )
        print(f"Status: {status}")
        assert status == 200, f"Expected 200, got {status}"
        admin_token = body["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 10: Admin Creates Accountant
        # ----------------------------------------------------
        print("[Test 10] Admin Creates Accountant (Amit Accountant)")
        status, body = request(
            "POST",
            "/api/users",
            data={
                "name": "Amit Accountant",
                "login_id": "amit01",
                "email": "amit@example.com",
                "password": "Secure@1234",
                "role": "accountant",
            },
            headers=admin_headers,
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 201, f"Expected 201, got {status}"
        assert body["role"] == "accountant"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 11: Admin Creates User
        # ----------------------------------------------------
        print("[Test 11] Admin Creates Regular User (Suresh User)")
        status, body = request(
            "POST",
            "/api/users",
            data={
                "name": "Suresh User",
                "login_id": "suresh01",
                "email": "suresh@example.com",
                "password": "Secure@1234",
                "role": "user",
            },
            headers=admin_headers,
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 201, f"Expected 201, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 12: Admin Creates Admin
        # ----------------------------------------------------
        print("[Test 12] Admin Creates Secondary Admin (Neha Admin)")
        status, body = request(
            "POST",
            "/api/users",
            data={
                "name": "Neha Admin",
                "login_id": "neha01",
                "email": "neha@example.com",
                "password": "Secure@1234",
                "role": "admin",
            },
            headers=admin_headers,
        )
        print(f"Status: {status}, Body: {body}")
        assert status == 201, f"Expected 201, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 13: Inactive User Test
        # ----------------------------------------------------
        print("[Test 13] Inactive User Access Verification")
        # Deactivate suresh01 in DB
        db = SessionLocal()
        suresh = db.query(User).filter(User.login_id == "suresh01").first()
        suresh.is_active = False
        db.commit()
        db.close()

        # Attempt login for suresh01
        status, body = request(
            "POST",
            "/api/auth/login",
            {"login_id": "suresh01", "password": "Secure@1234"},
        )
        print(f"Login Status for inactive user: {status}, Body: {body}")
        assert status == 401, f"Expected 401, got {status}"
        print("-> PASSED\n")

        print("============================================")
        print(" ALL 13 MANUAL TEST CHECKLIST ITEMS PASSED!")
        print("============================================")

    finally:
        proc.terminate()
        proc.wait()


if __name__ == "__main__":
    run_tests()
