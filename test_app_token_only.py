"""
Test if app token works for enhanced rate limits on public datasets.
"""

import requests
import time

app_token = "ciwjrlxs4tbyj9xh8m8zouxak"

print("=" * 80)
print("Testing CDC App Token on Public Datasets")
print("=" * 80)

# Test with and without app token on a known-good public dataset
test_dataset = "swc5-untb"  # PLACES county 2024
url = f"https://data.cdc.gov/resource/{test_dataset}.json"
params = {"$limit": 2, "stateabbr": "CA"}

print("\n1. Testing WITHOUT app token:")
print("-" * 80)
try:
    response = requests.get(url, params=params, timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS: Retrieved {len(data)} records")
        print(f"   Rate limit headers:")
        print(f"      X-RateLimit-Limit: {response.headers.get('X-RateLimit-Limit', 'N/A')}")
        print(f"      X-RateLimit-Remaining: {response.headers.get('X-RateLimit-Remaining', 'N/A')}")
except Exception as e:
    print(f"   ❌ FAILED: {str(e)}")

time.sleep(1)

print("\n2. Testing WITH app token (X-App-Token header):")
print("-" * 80)
try:
    headers = {"X-App-Token": app_token}
    response = requests.get(url, params=params, headers=headers, timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS: Retrieved {len(data)} records")
        print(f"   Rate limit headers:")
        print(f"      X-RateLimit-Limit: {response.headers.get('X-RateLimit-Limit', 'N/A')}")
        print(f"      X-RateLimit-Remaining: {response.headers.get('X-RateLimit-Remaining', 'N/A')}")
    else:
        print(f"   ❌ FAILED: HTTP {response.status_code}")
except Exception as e:
    print(f"   ❌ FAILED: {str(e)}")

print("\n" + "=" * 80)
print("Testing Restricted Dataset (Chronic Disease Indicators)")
print("=" * 80)

# Test restricted dataset
restricted_url = "https://data.cdc.gov/resource/g4ie-h725.json"
restricted_params = {"$limit": 2}

print("\n3. Testing restricted dataset WITH app token:")
print("-" * 80)
try:
    headers = {"X-App-Token": app_token}
    response = requests.get(restricted_url, params=restricted_params, headers=headers, timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS: Retrieved {len(data)} records")
        print(f"   This dataset is NOT restricted - app token works!")
    elif response.status_code == 403:
        print(f"   ❌ 403 Forbidden: Dataset requires special permissions")
        print(f"   App token valid but insufficient for this dataset")
    else:
        print(f"   ❌ HTTP {response.status_code}: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ FAILED: {str(e)}")

print("\n" + "=" * 80)
print("CONCLUSION")
print("=" * 80)
print("If test #2 shows higher rate limit than test #1:")
print("  → App token is VALID and working for rate limiting")
print("\nIf test #3 still shows 403:")
print("  → These datasets require special permissions beyond app token")
print("  → May need to request access from CDC data.gov team")
print("  → Or datasets may be deprecated/restricted to CDC internal use")
