"""
Test new CDC app token credentials.
"""

import requests
import time
import base64

# New credentials
app_token = "jkzjoQZdZT2gPquaUmiNsWEb0"
app_token_secret = "rX1skVe9gcyBChPbNOTrk11M_OE0jqcUOFED"

print("=" * 80)
print("Testing NEW CDC Credentials")
print("=" * 80)

# Test 1: Public dataset with X-App-Token only
print("\n1. Testing public dataset WITH X-App-Token header:")
print("-" * 80)

url = "https://data.cdc.gov/resource/swc5-untb.json"  # PLACES county 2024
params = {"$limit": 2, "stateabbr": "CA"}
headers = {"X-App-Token": app_token}

try:
    response = requests.get(url, params=params, headers=headers, timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS: Retrieved {len(data)} records")
        print(f"   Rate limit: {response.headers.get('X-RateLimit-Limit', 'N/A')}")
        print(f"   Remaining: {response.headers.get('X-RateLimit-Remaining', 'N/A')}")
    elif response.status_code == 403:
        print(f"   ❌ 403 Forbidden (app token blocked access)")
    else:
        print(f"   ❌ HTTP {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

time.sleep(1)

# Test 2: Public dataset with Basic Authentication
print("\n2. Testing public dataset WITH Basic Authentication:")
print("-" * 80)

credentials = f"{app_token}:{app_token_secret}"
encoded = base64.b64encode(credentials.encode()).decode()
headers_basic = {
    "Authorization": f"Basic {encoded}",
    "X-App-Token": app_token
}

try:
    response = requests.get(url, params=params, headers=headers_basic, timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS: Retrieved {len(data)} records")
        print(f"   Rate limit: {response.headers.get('X-RateLimit-Limit', 'N/A')}")
    elif response.status_code == 403:
        print(f"   ❌ 403 Forbidden")
    else:
        print(f"   ❌ HTTP {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

time.sleep(1)

# Test 3: Restricted dataset (Chronic Disease Indicators)
print("\n3. Testing RESTRICTED dataset (Chronic Disease Indicators):")
print("-" * 80)

restricted_url = "https://data.cdc.gov/resource/g4ie-h725.json"
restricted_params = {"$limit": 2}

print("\n   a) With X-App-Token only:")
try:
    response = requests.get(restricted_url, params=restricted_params, headers=headers, timeout=30)
    print(f"      Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"      ✅ SUCCESS: Retrieved {len(data)} records - DATASET UNLOCKED!")
    elif response.status_code == 403:
        print(f"      ❌ 403 Forbidden")
except Exception as e:
    print(f"      ❌ Error: {str(e)}")

time.sleep(1)

print("\n   b) With Basic Authentication:")
try:
    response = requests.get(restricted_url, params=restricted_params, headers=headers_basic, timeout=30)
    print(f"      Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"      ✅ SUCCESS: Retrieved {len(data)} records - DATASET UNLOCKED!")
    elif response.status_code == 403:
        print(f"      ❌ 403 Forbidden")
except Exception as e:
    print(f"      ❌ Error: {str(e)}")

time.sleep(1)

# Test 4: BRFSS restricted datasets
print("\n4. Testing BRFSS Chronic Health Indicators:")
print("-" * 80)

brfss_url = "https://chronicdata.cdc.gov/resource/u7k3-tu8b.json"
brfss_params = {"$limit": 2}

print("\n   With X-App-Token:")
try:
    response = requests.get(brfss_url, params=brfss_params, headers=headers, timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS: Retrieved {len(data)} records - DATASET UNLOCKED!")
    elif response.status_code == 403:
        print(f"   ❌ 403 Forbidden")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Summary
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print("\nIf all tests show 200 OK:")
print("  → Credentials are VALID and working!")
print("  → Add to .mcp.json as CDC_APP_TOKEN and CDC_APP_TOKEN_SECRET")
print("\nIf public datasets work but restricted fail:")
print("  → Credentials valid for rate limiting only")
print("  → Restricted datasets require special CDC permissions")
print("\nIf tests show 403 Forbidden:")
print("  → Credentials invalid or expired")
print("  → Do NOT add to .mcp.json")
